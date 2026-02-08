#!/bin/bash

# Integrated Research Platform Deployment Script
# Deploys Open Notebook + NotebookLM Columns together

set -e  # Exit on error

echo "=========================================="
echo "  Integrated Research Platform"
echo "  Open Notebook + NotebookLM Columns"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    echo "Please install Docker first:"
    echo "  - Mac/Windows: https://www.docker.com/products/docker-desktop/"
    echo "  - Linux: https://docs.docker.com/engine/install/"
    exit 1
fi

echo -e "${GREEN}✅ Docker is installed${NC}"
echo ""

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker Compose is installed${NC}"
echo ""

# Deployment options
echo -e "${BLUE}Choose deployment configuration:${NC}"
echo "1) Basic (Open Notebook + Columns only)"
echo "2) With Nginx Gateway (unified access at http://localhost)"
echo "3) With Ollama (free local AI models)"
echo "4) Full stack (Gateway + Ollama)"
read -p "Enter choice (1-4) [1]: " DEPLOY_CONFIG
DEPLOY_CONFIG=${DEPLOY_CONFIG:-1}

# AI Provider selection
echo ""
echo -e "${BLUE}Choose AI provider:${NC}"
echo "1) OpenAI (GPT-4, GPT-3.5)"
echo "2) Anthropic (Claude)"
echo "3) Google (Gemini)"
echo "4) Ollama (free, local - will be installed)"
echo "5) Multiple providers (enter keys for all)"
read -p "Enter choice (1-5) [1]: " AI_PROVIDER
AI_PROVIDER=${AI_PROVIDER:-1}

# Create directories
echo ""
echo -e "${YELLOW}Creating directory structure...${NC}"
mkdir -p shared-data/{notebook_data,surreal_data,documents}
mkdir -p logs
mkdir -p nginx
mkdir -p columns

echo -e "${GREEN}✅ Directories created${NC}"

# Get API keys based on selection
echo ""
if [ "$AI_PROVIDER" != "4" ]; then
    echo -e "${YELLOW}AI Provider API Keys${NC}"
    echo "Leave blank to skip a provider"
    echo ""
fi

OPENAI_KEY=""
ANTHROPIC_KEY=""
GOOGLE_KEY=""

if [ "$AI_PROVIDER" = "1" ] || [ "$AI_PROVIDER" = "5" ]; then
    read -p "OpenAI API Key: " OPENAI_KEY
fi

if [ "$AI_PROVIDER" = "2" ] || [ "$AI_PROVIDER" = "5" ]; then
    read -p "Anthropic API Key: " ANTHROPIC_KEY
fi

if [ "$AI_PROVIDER" = "3" ] || [ "$AI_PROVIDER" = "5" ]; then
    read -p "Google API Key: " GOOGLE_KEY
fi

# Create .env file
echo ""
echo -e "${YELLOW}Creating environment configuration...${NC}"

cat > .env << EOF
# AI Provider Keys
OPENAI_API_KEY=${OPENAI_KEY}
ANTHROPIC_API_KEY=${ANTHROPIC_KEY}
GOOGLE_API_KEY=${GOOGLE_KEY}

# Ollama (local models)
OLLAMA_HOST=http://ollama:11434

# Database
SURREAL_URL=ws://localhost:8000/rpc
SURREAL_USER=root
SURREAL_PASSWORD=root
SURREAL_NAMESPACE=research_platform
SURREAL_DATABASE=production

# Integration
ENABLE_INTEGRATION=true
EOF

echo -e "${GREEN}✅ Configuration created${NC}"

# Create nginx config if needed
if [ "$DEPLOY_CONFIG" = "2" ] || [ "$DEPLOY_CONFIG" = "4" ]; then
    echo ""
    echo -e "${YELLOW}Creating Nginx configuration...${NC}"
    
    cat > nginx/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream open_notebook {
        server open-notebook:8502;
    }
    
    upstream columns {
        server notebook-columns:3000;
    }
    
    server {
        listen 80;
        server_name localhost;
        
        # Open Notebook UI
        location / {
            proxy_pass http://open_notebook;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # Columns UI
        location /columns {
            rewrite ^/columns/(.*) /$1 break;
            proxy_pass http://columns;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
        
        # Columns API
        location /api/columns {
            rewrite ^/api/columns/(.*) /api/$1 break;
            proxy_pass http://columns;
            proxy_set_header Host $host;
        }
        
        # Open Notebook API
        location /api/notebook {
            proxy_pass http://open_notebook:5055;
            proxy_set_header Host $host;
        }
    }
}
EOF

    echo -e "${GREEN}✅ Nginx configured${NC}"
fi

# Copy NotebookLM Columns files if not already present
if [ ! -f "columns/server.js" ]; then
    echo ""
    echo -e "${YELLOW}Copying NotebookLM Columns files...${NC}"
    
    # Copy from current directory
    cp -r server.js public package*.json columns/ 2>/dev/null || true
    
    if [ ! -f "columns/server.js" ]; then
        echo -e "${YELLOW}⚠️  NotebookLM Columns files not found${NC}"
        echo "Please ensure columns files are in the current directory"
        echo "Or the deployment will use default configuration"
    else
        echo -e "${GREEN}✅ Columns files copied${NC}"
    fi
fi

# Build compose command based on config
COMPOSE_CMD="docker compose -f docker-compose.integrated.yml"
PROFILES=""

if [ "$DEPLOY_CONFIG" = "2" ] || [ "$DEPLOY_CONFIG" = "4" ]; then
    PROFILES="$PROFILES --profile with-gateway"
fi

if [ "$DEPLOY_CONFIG" = "3" ] || [ "$DEPLOY_CONFIG" = "4" ]; then
    PROFILES="$PROFILES --profile with-ollama"
fi

# Deploy
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Starting Deployment${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Pull images
echo -e "${YELLOW}Pulling Docker images...${NC}"
$COMPOSE_CMD $PROFILES pull

# Build custom images
echo -e "${YELLOW}Building custom images...${NC}"
$COMPOSE_CMD $PROFILES build

# Start services
echo -e "${YELLOW}Starting services...${NC}"
$COMPOSE_CMD $PROFILES up -d

# Wait for services to be ready
echo ""
echo -e "${YELLOW}Waiting for services to start...${NC}"
sleep 10

# Check status
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Deployment Status${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

$COMPOSE_CMD ps

# If Ollama is deployed, pull models
if [ "$DEPLOY_CONFIG" = "3" ] || [ "$DEPLOY_CONFIG" = "4" ] || [ "$AI_PROVIDER" = "4" ]; then
    echo ""
    echo -e "${YELLOW}Pulling Ollama models (this may take a few minutes)...${NC}"
    echo "Pulling llama3.2 (4GB)..."
    docker exec ollama ollama pull llama3.2 || true
    echo -e "${GREEN}✅ Ollama models ready${NC}"
fi

# Show access URLs
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Access your applications:${NC}"
echo ""

if [ "$DEPLOY_CONFIG" = "2" ] || [ "$DEPLOY_CONFIG" = "4" ]; then
    echo -e "${GREEN}🌐 Unified Gateway:${NC}"
    echo "   http://localhost"
    echo ""
    echo -e "${GREEN}📚 Open Notebook:${NC}"
    echo "   http://localhost/ (via gateway)"
    echo ""
    echo -e "${GREEN}📊 NotebookLM Columns:${NC}"
    echo "   http://localhost/columns (via gateway)"
else
    echo -e "${GREEN}📚 Open Notebook:${NC}"
    echo "   http://localhost:8502"
    echo ""
    echo -e "${GREEN}📊 NotebookLM Columns:${NC}"
    echo "   http://localhost:3000"
fi

echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo "  View logs:     docker compose -f docker-compose.integrated.yml logs -f"
echo "  Stop services: docker compose -f docker-compose.integrated.yml down"
echo "  Restart:       docker compose -f docker-compose.integrated.yml restart"
echo "  Update:        docker compose -f docker-compose.integrated.yml pull && docker compose -f docker-compose.integrated.yml up -d"
echo ""
echo -e "${YELLOW}📖 For more information, see OPEN_NOTEBOOK_INTEGRATION.md${NC}"
echo ""
echo -e "${GREEN}Happy researching! 🚀${NC}"
