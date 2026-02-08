# 🔗 Integrated Research Platform

## NotebookLM Columns + Open Notebook

**The ultimate privacy-first research platform combining structured analysis with RAG-powered synthesis.**

---

## 🎯 What You Get

### Combined Platform Features

| Feature | Source | Description |
|---------|--------|-------------|
| **Document Processing** | Open Notebook | Upload PDFs, videos, audio, web pages |
| **RAG Chat** | Open Notebook | Context-aware conversations with your documents |
| **Podcast Generation** | Open Notebook | Multi-speaker podcasts from your research |
| **Structured Tables** | NotebookLM Columns | Organize insights in spreadsheet-like format |
| **AI Column Filling** | NotebookLM Columns | Automatically extract structured data |
| **Comparative Analysis** | Both | Systematic comparison across sources |
| **Privacy-First Storage** | Both | SurrealDB - your data stays local |
| **16+ AI Providers** | Both | OpenAI, Claude, Gemini, Ollama, and more |

---

## ⚡ Quick Start (5 Minutes)

### Prerequisites

- **Docker** and **Docker Compose** installed
- **Optional**: API key from OpenAI, Anthropic, or Google
- **Alternative**: Use Ollama for free local models (no API key needed!)

### Automated Deployment

```bash
# 1. Download the deployment script
chmod +x deploy-integrated.sh

# 2. Run it (interactive setup)
./deploy-integrated.sh

# 3. Access your platform
# Open Notebook: http://localhost:8502
# Columns UI: http://localhost:3000
# Unified: http://localhost
```

**✅ Done!** You now have a complete integrated research platform.

---

## 📚 Manual Deployment

### Step 1: Create Configuration

```bash
# Create .env file
cat > .env << EOF
OPENAI_API_KEY=sk-your-key-here
ANTHROPIC_API_KEY=sk-ant-your-key-here
GOOGLE_API_KEY=your-gemini-key
EOF
```

### Step 2: Start Services

```bash
# Start all services
docker compose -f docker-compose-integrated.yml up -d

# Check status
docker compose -f docker-compose-integrated.yml ps

# View logs
docker compose -f docker-compose-integrated.yml logs -f
```

### Step 3: Access Services

- **Open Notebook**: http://localhost:8502
- **Columns UI**: http://localhost:3000
- **Unified Access**: http://localhost

---

## 🎬 Example Workflows

### Workflow 1: Literature Review

**Goal**: Analyze 10 academic papers systematically

1. **Upload Papers** (Open Notebook)
   - Go to http://localhost:8502
   - Upload 10 PDFs
   - Wait for processing (~2 min per paper)

2. **Chat with Papers** (Open Notebook)
   - Ask: "What are the main research questions?"
   - Ask: "Compare the methodologies used"

3. **Organize in Columns** (NotebookLM Columns)
   - Go to http://localhost/columns/
   - Create columns: Paper, Year, Methodology, Findings, Limitations
   - Click "Add Row" for each paper

4. **AI Fill Columns**
   - Right-click "Methodology" column
   - Select "Fill Column with AI..."
   - Enter: "Describe the research methodology in 1-2 sentences"
   - AI extracts from all papers using RAG

5. **Generate Podcast** (Open Notebook)
   - Return to http://localhost:8502
   - Click "Generate Podcast"
   - Listen to AI discussing your organized findings

### Workflow 2: Competitive Analysis

**Goal**: Compare 5 competitors across multiple dimensions

1. **Gather Data** (Open Notebook)
   - Upload competitor reports, websites, presentations
   - Chat to extract key information

2. **Structure Analysis** (Columns)
   - Create columns: Company, Pricing, Features, Market Share, Strengths, Weaknesses
   - Add 5 rows (one per competitor)

3. **AI Data Extraction**
   - Right-click each column header
   - Use "Fill Column with AI..." with specific prompts
   - Example: "What is the pricing model? Include all tiers."

4. **Comparative Synthesis**
   - Select multiple columns
   - Click "Compare Columns"
   - AI generates comparative analysis

5. **Export Findings**
   - Copy table data to your report
   - Or generate podcast summary

### Workflow 3: Multi-Modal Research

**Goal**: Analyze video interviews, PDFs, and audio recordings

1. **Upload All Media** (Open Notebook)
   - Upload videos (YouTube or local files)
   - Upload PDFs (transcripts, reports)
   - Upload audio (interviews, podcasts)

2. **Process Everything**
   - Open Notebook transcribes videos and audio
   - Chunks all documents
   - Creates unified searchable database

3. **Structured Extraction** (Columns)
   - Create columns: Source Type, Key Quote, Main Theme, Timestamp
   - AI fills using RAG across all media

4. **Timeline Analysis**
   - Sort by timestamp
   - Identify patterns across time
   - Generate chronological summary podcast

---

## 🔧 Configuration

### AI Provider Setup

#### Option 1: OpenAI (Recommended)

```bash
# Get API key: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-xxx
```

**Best for**: General use, reliable, good quality

#### Option 2: Anthropic Claude

```bash
# Get API key: https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-xxx
```

**Best for**: Long context (200K tokens), nuanced analysis

#### Option 3: Google Gemini

```bash
# Get API key: https://ai.google.dev/
GOOGLE_API_KEY=AIzaSxxx
```

**Best for**: Free tier, multimodal capabilities

#### Option 4: Ollama (Free!)

```bash
# No API key needed - runs locally
OLLAMA_HOST=http://ollama:11434
```

**Best for**: Complete privacy, no costs, offline use

**Setup Ollama**:
```bash
# Uncomment in docker-compose-integrated.yml
# Then pull models:
docker exec research-ollama ollama pull llama2
docker exec research-ollama ollama pull mistral
docker exec research-ollama ollama pull codellama
```

### Advanced Configuration

#### Resource Limits

```yaml
# In docker-compose-integrated.yml
services:
  notebook-columns:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
```

#### Database Persistence

```yaml
volumes:
  surreal_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /path/to/your/backup/location
```

---

## 🔒 Security & Privacy

### Why This Platform is Private

1. **Local Storage**: All data in SurrealDB on your machine
2. **No Cloud**: Documents never leave your infrastructure
3. **Self-Hosted**: Complete control over deployment
4. **Optional Cloud AI**: Only query text sent to AI providers, not full documents
5. **Local AI Option**: Use Ollama for 100% local processing

### Production Security

```bash
# Change default passwords
SURREAL_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

# Enable HTTPS (see nginx-integrated.conf)
# Add SSL certificates
# Use strong authentication
```

---

## 📊 Architecture

### System Components

```
┌─────────────────────────────────────────────────┐
│              User Browser                       │
└────────────┬────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────┐
│        Nginx Reverse Proxy (Port 80)           │
│  Routes: /          → Open Notebook UI         │
│          /columns/  → Columns UI                │
│          /api/      → Backend APIs              │
└────────────┬────────────────────────────────────┘
             │
         ┌───┴───┐
         ▼       ▼
    ┌────────┐  ┌──────────────┐
    │  Open  │  │  NotebookLM  │
    │Notebook│  │   Columns    │
    │:8502   │  │   :3000      │
    └───┬────┘  └──────┬───────┘
        │              │
        └──────┬───────┘
               ▼
       ┌───────────────┐
       │  SurrealDB    │
       │   :8000       │
       │ (Shared Data) │
       └───────────────┘
```

### Data Flow

1. **Upload**: User → Open Notebook → SurrealDB
2. **Process**: Open Notebook chunks, embeds, stores
3. **Query**: Columns → Open Notebook API → RAG Search
4. **AI**: Context + Prompt → AI Provider → Structured Response
5. **Display**: Columns Table View → User

---

## 🆘 Troubleshooting

### Services Won't Start

```bash
# Check Docker is running
docker ps

# Check logs
docker compose -f docker-compose-integrated.yml logs

# Restart services
docker compose -f docker-compose-integrated.yml restart

# Nuclear option: clean restart
docker compose -f docker-compose-integrated.yml down -v
docker compose -f docker-compose-integrated.yml up -d
```

### Cannot Connect to Services

```bash
# Check if ports are accessible
curl http://localhost:8502
curl http://localhost:3000
curl http://localhost

# Check network
docker network ls
docker network inspect research-network
```

### AI Features Not Working

```bash
# Verify API keys in .env
cat .env | grep API_KEY

# Check Open Notebook logs
docker logs open-notebook-rag

# Check Columns logs
docker logs notebook-columns
```

### Database Issues

```bash
# Check SurrealDB status
docker logs research-surrealdb

# Connect to SurrealDB directly
docker exec -it research-surrealdb surreal sql

# Backup database
docker exec research-surrealdb surreal export /mydata/backup.surql
```

---

## 📈 Performance Tuning

### Recommended Resources

- **Minimum**: 4GB RAM, 2 CPU cores
- **Recommended**: 8GB RAM, 4 CPU cores
- **Optimal**: 16GB RAM, 8 CPU cores

### Scaling Tips

1. **Add More RAM**: Helps with large document processing
2. **Use SSD**: Faster database operations
3. **Dedicated GPU**: If using local Ollama models
4. **Multiple Workers**: Scale notebook-columns horizontally

---

## 🎯 Next Steps

### 1. ✅ Deploy

```bash
./deploy-integrated.sh
```

### 2. 📖 Learn

Read the integration guides:
- [OPEN_NOTEBOOK_INTEGRATION.md](OPEN_NOTEBOOK_INTEGRATION.md)
- [GETTING_STARTED.md](GETTING_STARTED.md)
- [FEATURE_DEMO.md](FEATURE_DEMO.md)

### 3. 🧪 Experiment

Try the example workflows above:
- Literature review
- Competitive analysis
- Multi-modal research

### 4. 🚀 Customize

Adjust configuration for your needs:
- Add more AI providers
- Customize column templates
- Create your own workflows

### 5. 🤝 Share

Deploy for your team:
- Use HTTPS in production
- Add authentication
- Scale resources

---

## 📞 Support

### Documentation

- **Integration Guide**: [OPEN_NOTEBOOK_INTEGRATION.md](OPEN_NOTEBOOK_INTEGRATION.md)
- **Deployment**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **AI Setup**: [AI_INTEGRATION_GUIDE.md](AI_INTEGRATION_GUIDE.md)
- **Quick Reference**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

### Community

- **Open Notebook Discord**: https://discord.gg/37XJPXfz2w
- **Open Notebook GitHub**: https://github.com/AshrafALhilaly/open-notebook
- **Report Issues**: GitHub Issues

---

## 🎉 What Makes This Special

### Unlike Any Other Tool

**Open Notebook alone**: Great RAG chat, but no structured organization  
**NotebookLM Columns alone**: Great structured analysis, but limited document processing  
**This Integration**: 🌟 **Best of both worlds** 🌟

### Key Differentiators

1. ✅ **Privacy-First**: Everything local, unlike cloud-only tools
2. ✅ **Structured + Unstructured**: Tables + Chat in one platform
3. ✅ **Multi-Modal**: PDFs, videos, audio - all in one place
4. ✅ **Free AI Option**: Ollama for zero-cost inference
5. ✅ **Open Source**: Inspect, modify, extend as you wish

---

## 🚀 Ready to Go!

**Everything you need is ready**:
- ✅ Docker Compose configuration
- ✅ Automated deployment script
- ✅ Complete documentation
- ✅ Example workflows
- ✅ Troubleshooting guides

**Start your integrated research platform in 5 minutes**:

```bash
./deploy-integrated.sh
```

**Access your new platform**:
- http://localhost:8502 (Open Notebook)
- http://localhost:3000 (Columns)
- http://localhost (Unified)

---

**🎉 Welcome to the future of research! Happy analyzing!** 🚀

[Quick Start](GETTING_STARTED.md) | [Integration Guide](OPEN_NOTEBOOK_INTEGRATION.md) | [Full Docs](PROJECT_DOCUMENTATION.md)
