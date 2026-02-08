# Notebook LM - Columns Feature Prototype

A fully functional implementation of the Columns feature for Notebook LM, transforming note-taking into structured, AI-powered research and analysis.

## 🌐 Live Application

**Access the working prototype:** https://3000-i5fcxttpl7cc0hvmek9du-5185f4aa.sandbox.novita.ai

## 📚 Complete Documentation

👉 **[SEE INDEX.md FOR COMPLETE NAVIGATION GUIDE](INDEX.md)**

## 🚀 Quick Start

```bash
npm install
npm start
```

Access at: **http://localhost:3000**

## ✨ Features

- **📊 Table View**: Spreadsheet-like interface for structured data
- **📝 List View**: Traditional card-based note view
- **🤖 AI Integration**: Generate, fill, and compare columns with AI
- **🎯 Drag & Drop**: Reorder rows and columns intuitively
- **✏️ Inline Editing**: Edit cells directly with auto-save
- **🎨 Modern UI**: Clean, responsive design

## 📖 Documentation

See [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) for complete documentation including:
- Detailed feature list
- API documentation
- User guide
- Technical architecture
- Development guidelines

## 🎯 PRD Implementation

This prototype implements **all functional requirements** (FR1-FR4) from the Product Requirements Document v1.0:
- ✅ Complete column management
- ✅ Full row & cell operations
- ✅ AI-powered features
- ✅ Dual view system

## 🛠️ Tech Stack

- **Frontend**: React 18, Vanilla CSS
- **Backend**: Node.js, Express
- **AI**: Simulated AI responses (ready for LLM integration)

## 🔗 Open Notebook Integration

**NEW**: Integrate with [Open Notebook](https://github.com/AshrafALhilaly/open-notebook) for powerful RAG + structured comparison!

```bash
# Quick Deploy (Integrated Stack)
./deploy-integrated.sh

# Access services
# - Open Notebook: http://localhost:8502
# - Columns: http://localhost:3000
# - Unified: http://localhost
```

**📖 Full Integration Guide**: [OPEN_NOTEBOOK_INTEGRATION.md](OPEN_NOTEBOOK_INTEGRATION.md)  
**⚡ Quick Start**: [INTEGRATION_QUICKSTART.md](INTEGRATION_QUICKSTART.md)

### Why Integrate?

Combine the best of both:
- ✅ Open Notebook's RAG chat + multi-modal processing
- ✅ NotebookLM Columns' structured comparison
- ✅ Shared SurrealDB database
- ✅ Unified interface via Nginx

## 📦 Project Structure

```
├── server.js                        # Backend API
├── public/                          # Frontend files
│   ├── index.html                  # HTML entry
│   ├── styles.css                  # Styles
│   └── app.js                      # React app
├── integration-docker-compose.yml   # Integrated deployment
├── nginx-integrated.conf            # Nginx configuration
├── deploy-integrated.sh             # One-command deploy
└── package.json                     # Dependencies
```

## 🎨 Key Use Cases

1. **Research Analysts**: Compare competitor data side-by-side
2. **Academic Researchers**: Organize literature reviews systematically
3. **Content Creators**: Structure arguments with evidence

---

**Version**: 1.0.0 | **License**: MIT
