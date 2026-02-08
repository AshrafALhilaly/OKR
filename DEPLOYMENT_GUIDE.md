# 🚀 NotebookLM Columns - Deployment Guide

## Overview

NotebookLM Columns is a self-hosted AI-powered research tool that helps you organize, compare, and analyze information across multiple sources with structured tabular organization.

---

## 🎯 Quick Start (5 Minutes)

### Prerequisites
- Node.js 14+ installed
- Git (for cloning the repository)
- 2GB RAM minimum
- 1GB free disk space

### Installation Steps

```bash
# 1. Clone or download the project
cd /home/user/webapp

# 2. Install dependencies
npm install

# 3. Start the server
npm start

# 4. Access the application
open http://localhost:3000
```

**✅ You're ready!** The application is now running locally.

---

## 📦 Installation Options

### Option 1: Docker Deployment (Recommended)

**Best for**: Production deployments, easy scaling, consistent environments

#### Step 1: Create Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY server.js ./
COPY public ./public

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/notebooks/default', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["node", "server.js"]
```

#### Step 2: Create docker-compose.yml

```yaml
# docker-compose.yml
version: '3.8'

services:
  notebook-columns:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
    volumes:
      - notebook-data:/app/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/notebooks/default"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  notebook-data:
```

#### Step 3: Deploy

```bash
# Build and start
docker-compose up -d

# Check logs
docker-compose logs -f

# Access application
open http://localhost:3000
```

#### Step 4: Update

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose up -d --build
```

---

### Option 2: Source Installation (Development)

**Best for**: Developers who want to customize or contribute

```bash
# 1. Clone repository
git clone <repository-url>
cd webapp

# 2. Install dependencies
npm install

# 3. Start development server with auto-reload
npm run dev

# 4. Access application
open http://localhost:3000
```

**Development Features**:
- Auto-reload on file changes (using nodemon)
- Full source code access
- Easy debugging with VS Code

---

### Option 3: PM2 Process Manager (Production)

**Best for**: VPS deployment, long-running processes, monitoring

#### Step 1: Install PM2

```bash
npm install -g pm2
```

#### Step 2: Create ecosystem.config.js

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'notebook-columns',
    script: './server.js',
    instances: 1,
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
```

#### Step 3: Deploy

```bash
# Start application
pm2 start ecosystem.config.js

# Setup startup script (to restart on reboot)
pm2 startup
pm2 save

# Monitor
pm2 monit

# View logs
pm2 logs notebook-columns

# Restart
pm2 restart notebook-columns
```

---

### Option 4: Cloud Platform Deployment

#### Heroku

```bash
# 1. Create Procfile
echo "web: node server.js" > Procfile

# 2. Deploy
heroku create notebook-columns
git push heroku main

# 3. Open
heroku open
```

#### Railway

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login and init
railway login
railway init

# 3. Deploy
railway up

# 4. Get URL
railway open
```

#### DigitalOcean App Platform

1. Connect GitHub repository
2. Select "Node.js" as build type
3. Set build command: `npm install`
4. Set run command: `node server.js`
5. Set port: `3000`
6. Deploy

#### Google Cloud Run

```bash
# 1. Build container
gcloud builds submit --tag gcr.io/PROJECT_ID/notebook-columns

# 2. Deploy
gcloud run deploy notebook-columns \
  --image gcr.io/PROJECT_ID/notebook-columns \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# 3. Get URL
gcloud run services describe notebook-columns --format 'value(status.url)'
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```bash
# Server Configuration
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# AI Configuration (for production with real AI)
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# Alternative: Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Alternative: Google Gemini
GOOGLE_API_KEY=your-gemini-key-here

# Rate Limiting
MAX_AI_REQUESTS_PER_HOUR=10
MAX_NOTEBOOKS_PER_USER=100

# Storage (for production)
DATABASE_URL=postgresql://user:pass@localhost/notebooks
REDIS_URL=redis://localhost:6379
```

### Model Configuration

After installation, configure AI model providers in the application settings:

**Supported Providers**:
- ✅ OpenAI (GPT-3.5, GPT-4)
- ✅ Anthropic (Claude 3 Opus, Sonnet, Haiku)
- ✅ Google (Gemini Pro, Gemini Ultra)
- ✅ Local models via Ollama
- ✅ OpenRouter (access to multiple models)

See [AI_INTEGRATION_GUIDE.md](AI_INTEGRATION_GUIDE.md) for detailed setup.

---

## 🔒 Security Best Practices

### 1. Use HTTPS in Production

#### With Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/notebook-columns
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Enable Nginx

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/notebook-columns /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo certbot --nginx -d your-domain.com
```

### 2. Secure API Keys

```bash
# Never commit .env files
echo ".env" >> .gitignore

# Use secrets management in production
# - AWS Secrets Manager
# - Google Secret Manager
# - HashiCorp Vault
```

### 3. Enable Rate Limiting

Already implemented in `server.js`. Adjust limits as needed:

```javascript
// In server.js
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit per window
  message: 'Too many AI requests, please try again later.'
});
```

---

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Check if server is running
curl http://localhost:3000/api/notebooks/default

# Expected response: JSON with notebook data
```

### Logging

#### Docker Logs

```bash
docker-compose logs -f --tail=100
```

#### PM2 Logs

```bash
pm2 logs notebook-columns --lines 100
```

#### Custom Logging Setup

```javascript
// Add to server.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Monitoring Tools

**Free Options**:
- UptimeRobot (uptime monitoring)
- New Relic (APM)
- Sentry (error tracking)
- LogRocket (session replay)

**Setup Example (Sentry)**:

```bash
npm install @sentry/node
```

```javascript
// In server.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

// Add error handler
app.use(Sentry.Handlers.errorHandler());
```

---

## 🗄️ Database Setup (Production)

### PostgreSQL (Recommended)

```bash
# 1. Install PostgreSQL
sudo apt-get install postgresql

# 2. Create database
sudo -u postgres createdb notebooks

# 3. Install driver
npm install pg

# 4. Update connection string in .env
DATABASE_URL=postgresql://user:password@localhost/notebooks
```

### Migration from In-Memory

```javascript
// Add to server.js
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Replace in-memory storage with database queries
// See PROJECT_DOCUMENTATION.md for data model
```

---

## 🚀 Performance Optimization

### 1. Enable Compression

```bash
npm install compression
```

```javascript
// In server.js
const compression = require('compression');
app.use(compression());
```

### 2. Add Caching

```bash
npm install redis
```

```javascript
const redis = require('redis');
const client = redis.createClient({
  url: process.env.REDIS_URL
});

// Cache AI responses
async function getCachedOrGenerate(key, generator) {
  const cached = await client.get(key);
  if (cached) return JSON.parse(cached);
  
  const result = await generator();
  await client.setEx(key, 3600, JSON.stringify(result)); // 1 hour cache
  return result;
}
```

### 3. CDN for Static Assets

```javascript
// In server.js
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public', {
    maxAge: '1y',
    etag: true,
    lastModified: true
  }));
}
```

---

## 🔄 Backup & Recovery

### Automated Backups

```bash
#!/bin/bash
# backup.sh

# Backup database
pg_dump notebooks > "backup_$(date +%Y%m%d_%H%M%S).sql"

# Upload to cloud storage
aws s3 cp backup_*.sql s3://your-bucket/backups/

# Clean up old backups (keep last 30 days)
find . -name "backup_*.sql" -mtime +30 -delete
```

### Setup Cron Job

```bash
# Run daily at 2 AM
crontab -e

# Add line:
0 2 * * * /path/to/backup.sh
```

---

## 🆘 Troubleshooting

### Server Won't Start

```bash
# Check port availability
lsof -i :3000

# Kill process if needed
kill -9 <PID>

# Check Node.js version
node --version  # Should be 14+
```

### AI Features Not Working

```bash
# Check environment variables
echo $OPENAI_API_KEY

# Verify API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Performance Issues

```bash
# Check memory usage
free -m

# Check disk space
df -h

# Monitor Node.js process
top -p $(pgrep -f "node server.js")
```

---

## 📚 Additional Resources

- **Official Documentation**: [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)
- **AI Integration**: [AI_INTEGRATION_GUIDE.md](AI_INTEGRATION_GUIDE.md)
- **Quick Reference**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- **Demo Guide**: [FEATURE_DEMO.md](FEATURE_DEMO.md)

---

## 💬 Community & Support

### Get Help

- 📖 **Documentation**: Check the guides in this repository
- 🐛 **Report Issues**: Create GitHub issue with details
- 💡 **Feature Requests**: Submit via GitHub discussions

### Contributing

Contributions welcome! See CONTRIBUTING.md for guidelines.

---

## 🎯 Next Steps After Deployment

1. **Configure AI Models**: See [AI_INTEGRATION_GUIDE.md](AI_INTEGRATION_GUIDE.md)
2. **Try the Demo**: Follow [FEATURE_DEMO.md](FEATURE_DEMO.md)
3. **Set Up Monitoring**: Install Sentry or New Relic
4. **Enable HTTPS**: Use Let's Encrypt for SSL
5. **Schedule Backups**: Set up automated backups

---

**🚀 Ready to deploy!** Choose your installation method above and get started in 5 minutes.

**Live Demo**: https://3000-i5fcxttpl7cc0hvmek9du-5185f4aa.sandbox.novita.ai

**Questions?** Check [TROUBLESHOOTING.md](PROJECT_DOCUMENTATION.md) or open an issue.
