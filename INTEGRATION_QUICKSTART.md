# 🚀 Integration Quick Start Guide

## Deploy Open Notebook + NotebookLM Columns in 5 Minutes

---

## ⚡ Option 1: One-Command Deployment

```bash
# Clone the repository
git clone https://github.com/AshrafALhilaly/open-notebook.git
cd open-notebook

# Add NotebookLM Columns
git clone <your-columns-repo> columns
cp columns/integration-docker-compose.yml docker-compose.yml
cp columns/nginx-integrated.conf nginx.conf
cp columns/deploy-integrated.sh .

# Configure API keys
cat > .env << EOF
OPENAI_API_KEY=sk-your-key-here
ANTHROPIC_API_KEY=sk-ant-your-key-here
GOOGLE_API_KEY=your-gemini-key-here
EOF

# Deploy everything
chmod +x deploy-integrated.sh
./deploy-integrated.sh

# Access at http://localhost
```

**✅ Done!** You now have:
- Open Notebook at `http://localhost:8502`
- NotebookLM Columns at `http://localhost:3000`
- Unified access via `http://localhost`

---

## 🎯 Option 2: Manual Docker Compose

```bash
# Start all services
docker-compose -f integration-docker-compose.yml up -d

# Check status
docker-compose -f integration-docker-compose.yml ps

# View logs
docker-compose -f integration-docker-compose.yml logs -f

# Stop
docker-compose -f integration-docker-compose.yml down
```

---

## 📊 What You Get

### Architecture

```
┌─────────────────────────────────────┐
│  Nginx (Port 80)                    │
│  - Routes all requests              │
└─────────┬───────────────────────────┘
          │
    ┌─────┴─────────────┐
    │                   │
┌───▼──────────┐   ┌────▼──────────────┐
│ Open Notebook│   │ NotebookLM        │
│ (8502)       │   │ Columns (3000)    │
│              │   │                   │
│ - RAG Chat   │   │ - Tables          │
│ - Podcasts   │   │ - AI Columns      │
│ - Search     │   │ - Comparison      │
└──────┬───────┘   └─────┬─────────────┘
       │                 │
       └────────┬────────┘
                │
     ┌──────────▼──────────┐
     │   SurrealDB (8000)  │
     │   Shared Database   │
     └─────────────────────┘
```

### Services Running

| Service | Port | Purpose | Status |
|---------|------|---------|--------|
| **Nginx** | 80 | Reverse proxy | ✅ |
| **Open Notebook UI** | 8502 | Frontend | ✅ |
| **Open Notebook API** | 5055 | Backend | ✅ |
| **NotebookLM Columns** | 3000 | Tables feature | ✅ |
| **SurrealDB** | 8000 | Shared database | ✅ |
| **Ollama** (optional) | 11434 | Local AI | ⚠️ Optional |
| **Redis** (optional) | 6379 | Caching | ⚠️ Optional |

---

## 🔧 Configuration

### Minimum Configuration (.env)

```bash
# Required for AI features
OPENAI_API_KEY=sk-your-key-here

# Optional providers
ANTHROPIC_API_KEY=sk-ant-your-key-here
GOOGLE_API_KEY=your-gemini-key-here

# Database (default works)
SURREAL_URL=ws://surrealdb:8000/rpc
SURREAL_USER=root
SURREAL_PASS=root
```

### Full Configuration

See `.env.example` for all options including:
- AI model selection
- Rate limiting
- Caching settings
- Security options
- Logging levels

---

## 🎓 Usage Examples

### Example 1: Research Workflow

```bash
# 1. Upload PDF to Open Notebook
curl -X POST http://localhost:5055/sources \
  -F "file=@research-paper.pdf" \
  -F "notebook_id=my-notebook"

# 2. Chat with the PDF
curl -X POST http://localhost:5055/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the methodology?"}'

# 3. Switch to Columns view for comparison
# Visit: http://localhost/columns/

# 4. Create comparison columns
# - Methodology
# - Key Findings
# - Limitations

# 5. Use AI to fill columns
# Right-click column → Fill with AI
```

### Example 2: Competitive Analysis

```bash
# 1. Add competitor websites to Open Notebook
for url in competitor1.com competitor2.com competitor3.com; do
  curl -X POST http://localhost:5055/sources \
    -H "Content-Type: application/json" \
    -d "{\"type\": \"web\", \"url\": \"https://$url\"}"
done

# 2. Extract information with RAG
# Use Open Notebook chat interface

# 3. Create comparison table in Columns
# Visit: http://localhost/columns/

# 4. Create columns:
# - Company
# - Pricing
# - Key Features
# - Market Position

# 5. AI fills all columns automatically
```

---

## 🔍 Verification

### Check All Services

```bash
# Health checks
curl http://localhost/health                    # Nginx
curl http://localhost:8000/health               # SurrealDB
curl http://localhost:5055/health               # Open Notebook API
curl http://localhost:3000/api/notebooks/default # Columns

# Expected: All return 200 OK
```

### View Logs

```bash
# All services
docker-compose -f integration-docker-compose.yml logs -f

# Specific service
docker-compose -f integration-docker-compose.yml logs -f notebook-columns
docker-compose -f integration-docker-compose.yml logs -f open-notebook-api

# Last 100 lines
docker-compose -f integration-docker-compose.yml logs --tail=100
```

---

## 🆘 Troubleshooting

### Issue: Services not starting

```bash
# Check Docker is running
docker ps

# Check logs for errors
docker-compose -f integration-docker-compose.yml logs

# Restart services
docker-compose -f integration-docker-compose.yml restart
```

### Issue: Cannot connect to database

```bash
# Check SurrealDB is running
docker-compose -f integration-docker-compose.yml ps surrealdb

# Test connection
curl http://localhost:8000/health

# Restart SurrealDB
docker-compose -f integration-docker-compose.yml restart surrealdb
```

### Issue: AI features not working

```bash
# Check API keys are set
docker-compose -f integration-docker-compose.yml exec notebook-columns env | grep API_KEY

# Check Open Notebook configuration
docker-compose -f integration-docker-compose.yml exec open-notebook-api env | grep API_KEY

# If missing, add to .env and restart
docker-compose -f integration-docker-compose.yml restart
```

### Issue: Port conflicts

```bash
# Check which ports are in use
netstat -tuln | grep -E '80|3000|5055|8000|8502'

# Change ports in docker-compose.yml if needed
# Example: Change 80:80 to 8080:80
```

---

## 📚 Next Steps

### 1. Explore the Documentation

- **Integration Guide**: [OPEN_NOTEBOOK_INTEGRATION.md](OPEN_NOTEBOOK_INTEGRATION.md)
- **Deployment Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Getting Started**: [GETTING_STARTED.md](GETTING_STARTED.md)

### 2. Try the Features

**In Open Notebook**:
- Upload documents (PDF, audio, video, web)
- Use RAG chat to query your sources
- Generate podcasts from your notes
- Semantic search across documents

**In Columns**:
- Create structured comparison tables
- Use AI to fill columns automatically
- Compare sources side-by-side
- Export your analysis

**Combined Workflow**:
- Start in Open Notebook for document ingestion
- Switch to Columns for structured comparison
- Return to Open Notebook for insights and podcasts

### 3. Customize Your Setup

```bash
# Add more Ollama models (local AI)
docker exec ollama ollama pull llama2
docker exec ollama ollama pull mistral
docker exec ollama ollama pull codellama

# Configure Redis caching
# Edit docker-compose.yml to enable Redis

# Setup SSL/HTTPS
# See nginx.conf for HTTPS configuration
# Use Let's Encrypt: certbot --nginx
```

### 4. Scale for Production

```bash
# Add more replicas for load balancing
docker-compose -f integration-docker-compose.yml up -d --scale notebook-columns=3

# Setup monitoring
# Add Prometheus, Grafana, or other monitoring tools

# Configure backups
# See DEPLOYMENT_GUIDE.md for backup strategies
```

---

## 🎯 Use Cases

### Academic Research
- Import papers from multiple sources
- Chat with PDFs to understand content
- Create systematic comparison tables
- Compare methodologies, findings, and limitations
- Identify research gaps

### Business Intelligence
- Import competitor information
- Extract key data points with RAG
- Create feature comparison matrices
- Analyze market positioning
- Generate competitive reports

### Content Creation
- Research topics across sources
- Structure arguments with evidence
- Organize quotes and references
- Compare different perspectives
- Export structured outlines

---

## 💡 Pro Tips

### Tip 1: Keyboard Shortcuts

**In Columns View**:
- `Tab`: Navigate between cells
- `Ctrl/Cmd + Enter`: Save cell
- `Ctrl/Cmd + Z`: Undo

### Tip 2: AI Prompts

**Effective column filling prompts**:
- ✅ "Extract the main conclusion in 1-2 sentences"
- ✅ "List the 3 key findings as bullet points"
- ✅ "Identify the research methodology used"
- ❌ "Tell me everything about this" (too broad)

### Tip 3: Template Reuse

Create column templates for repeated workflows:
1. Set up columns for a common use case
2. Save as template (feature coming in V2)
3. Reuse for similar projects

### Tip 4: Hybrid Workflow

Combine Open Notebook's chat with Columns' structure:
1. Use chat to explore and understand sources
2. Switch to Columns to organize findings
3. Use AI column filling for systematic extraction
4. Return to chat for follow-up questions

---

## 📊 Performance Tips

### For Best Performance

```bash
# Allocate more resources to Docker
# Docker Desktop → Settings → Resources
# - CPUs: 4+ cores
# - Memory: 8+ GB
# - Disk: 10+ GB

# Use SSD storage for database
# Mount SurrealDB volume on SSD

# Enable Redis caching
# Uncomment Redis service in docker-compose.yml

# Use local AI models for speed
# Ollama models run entirely locally (no API latency)
```

---

## 🎉 You're Ready!

**Integrated Notebook Suite is running**:
- ✅ Open Notebook for RAG chat and multi-modal processing
- ✅ NotebookLM Columns for structured comparison
- ✅ Shared SurrealDB for unified data
- ✅ Nginx for seamless routing

**Start researching at**: http://localhost

---

**Questions?** Check the documentation or open an issue.

**Feedback?** We'd love to hear how you're using it!

🚀 **Happy Researching!**
