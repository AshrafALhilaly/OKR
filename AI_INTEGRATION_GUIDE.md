# 🤖 AI Integration Guide

## Overview

This guide explains how to replace the simulated AI responses with real AI models (OpenAI GPT-4, Anthropic Claude, Google Gemini, etc.) in the Notebook LM Columns prototype.

## Current Implementation

The prototype uses **simulated AI responses** in `server.js`:

```javascript
function generateAIResponses(prompt, count) {
  const templates = [
    'AI-generated analysis based on prompt',
    'Synthesized insight from sources',
    'Comprehensive summary',
    'Detailed evaluation',
    'Critical assessment'
  ];
  
  return Array(count).fill(null).map((_, i) => {
    return `${templates[i % templates.length]}: ${prompt.substring(0, 30)}...`;
  });
}
```

This provides a working interface while avoiding API costs during prototyping.

## Integration Options

### Option 1: OpenAI GPT-4 (Recommended)

#### Why Choose This
- Best-in-class text generation
- Strong reasoning capabilities
- Excellent at following complex prompts
- Well-documented API

#### Prerequisites
```bash
npm install openai
```

#### Environment Setup
```bash
# .env file
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview
```

#### Implementation

```javascript
// At the top of server.js
require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Replace generateAIResponses function
async function generateAIResponsesWithGPT4(prompt, notebook, columnId) {
  const responses = [];
  
  for (const row of notebook.rows) {
    // Build context from the row
    const context = buildRowContext(row, notebook);
    
    // Create the full prompt
    const fullPrompt = `
Context: You are analyzing research notes in a notebook.

Row Data:
${context}

Task: ${prompt}

Provide a concise, relevant response (max 200 words).
`;
    
    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a research assistant helping to analyze and synthesize information from multiple sources.'
          },
          {
            role: 'user',
            content: fullPrompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      });
      
      responses.push(completion.choices[0].message.content.trim());
    } catch (error) {
      console.error('OpenAI API error:', error);
      responses.push(`Error: ${error.message}`);
    }
  }
  
  return responses;
}

function buildRowContext(row, notebook) {
  const context = [];
  notebook.columns.forEach(col => {
    const value = row.cells[col.id];
    if (value) {
      context.push(`${col.name}: ${value}`);
    }
  });
  return context.join('\n');
}

// Update the API endpoint
app.post('/api/notebooks/:id/ai/fill-column', async (req, res) => {
  const { columnId, prompt } = req.body;
  const notebook = notebooks[req.params.id];
  
  if (!notebook) {
    return res.status(404).json({ error: 'Notebook not found' });
  }
  
  try {
    const aiResponses = await generateAIResponsesWithGPT4(prompt, notebook, columnId);
    
    notebook.rows.forEach((row, index) => {
      row.cells[columnId] = aiResponses[index];
    });
    
    res.json({ success: true, updatedRows: notebook.rows });
  } catch (error) {
    res.status(500).json({ error: 'AI generation failed', message: error.message });
  }
});
```

### Option 2: Anthropic Claude

#### Why Choose This
- Longer context windows (200K tokens)
- Better at nuanced analysis
- Strong safety features
- Excellent at structured output

#### Prerequisites
```bash
npm install @anthropic-ai/sdk
```

#### Implementation

```javascript
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function generateAIResponsesWithClaude(prompt, notebook, columnId) {
  const responses = [];
  
  for (const row of notebook.rows) {
    const context = buildRowContext(row, notebook);
    
    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: `Context:\n${context}\n\nTask: ${prompt}\n\nProvide a concise response:`
          }
        ]
      });
      
      responses.push(message.content[0].text);
    } catch (error) {
      console.error('Claude API error:', error);
      responses.push(`Error: ${error.message}`);
    }
  }
  
  return responses;
}
```

### Option 3: Google Gemini

#### Why Choose This
- Multimodal capabilities (text + images)
- Strong at factual accuracy
- Good performance/cost ratio
- Integrated with Google ecosystem

#### Prerequisites
```bash
npm install @google/generative-ai
```

#### Implementation

```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function generateAIResponsesWithGemini(prompt, notebook, columnId) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const responses = [];
  
  for (const row of notebook.rows) {
    const context = buildRowContext(row, notebook);
    const fullPrompt = `Context:\n${context}\n\nTask: ${prompt}\n\nResponse:`;
    
    try {
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      responses.push(response.text());
    } catch (error) {
      console.error('Gemini API error:', error);
      responses.push(`Error: ${error.message}`);
    }
  }
  
  return responses;
}
```

### Option 4: Local LLM (Ollama)

#### Why Choose This
- No API costs
- Complete data privacy
- No rate limits
- Full control

#### Prerequisites
```bash
# Install Ollama from https://ollama.ai
ollama pull llama2
npm install ollama
```

#### Implementation

```javascript
const ollama = require('ollama').default;

async function generateAIResponsesWithOllama(prompt, notebook, columnId) {
  const responses = [];
  
  for (const row of notebook.rows) {
    const context = buildRowContext(row, notebook);
    
    try {
      const response = await ollama.chat({
        model: 'llama2',
        messages: [
          {
            role: 'system',
            content: 'You are a research assistant.'
          },
          {
            role: 'user',
            content: `Context:\n${context}\n\nTask: ${prompt}`
          }
        ]
      });
      
      responses.push(response.message.content);
    } catch (error) {
      console.error('Ollama error:', error);
      responses.push(`Error: ${error.message}`);
    }
  }
  
  return responses;
}
```

## Advanced Features

### Batch Processing for Speed

Process multiple rows in parallel instead of sequentially:

```javascript
async function generateAIResponsesBatch(prompt, notebook, columnId) {
  const promises = notebook.rows.map(async (row) => {
    const context = buildRowContext(row, notebook);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a research assistant.'
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nTask: ${prompt}`
        }
      ],
      max_tokens: 300
    });
    
    return completion.choices[0].message.content.trim();
  });
  
  // Process all rows in parallel
  const responses = await Promise.all(promises);
  return responses;
}
```

### Source Document Integration

Include actual source documents in the AI context:

```javascript
function buildEnhancedContext(row, notebook) {
  const context = [buildRowContext(row, notebook)];
  
  // Find and include relevant source documents
  notebook.sources.forEach(source => {
    if (isSourceRelevantToRow(row, source)) {
      context.push(`\n--- Source: ${source.name} ---`);
      context.push(source.content.substring(0, 2000)); // First 2000 chars
    }
  });
  
  return context.join('\n');
}

function isSourceRelevantToRow(row, source) {
  // Check if row references this source
  const sourceColumn = row.cells['col-source'] || '';
  return sourceColumn.toLowerCase().includes(source.name.toLowerCase());
}
```

### Streaming Responses

Stream AI responses for better UX:

```javascript
app.post('/api/notebooks/:id/ai/fill-column-stream', async (req, res) => {
  const { columnId, prompt } = req.body;
  const notebook = notebooks[req.params.id];
  
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  for (const [index, row] of notebook.rows.entries()) {
    const context = buildRowContext(row, notebook);
    
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'user', content: `Context:\n${context}\n\nTask: ${prompt}` }
      ],
      stream: true
    });
    
    let fullResponse = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;
      
      // Send progress to client
      res.write(`data: ${JSON.stringify({
        rowIndex: index,
        content: fullResponse,
        done: false
      })}\n\n`);
    }
    
    notebook.rows[index].cells[columnId] = fullResponse;
    
    res.write(`data: ${JSON.stringify({
      rowIndex: index,
      content: fullResponse,
      done: true
    })}\n\n`);
  }
  
  res.write('data: [DONE]\n\n');
  res.end();
});
```

## Column Comparison with AI

Implement the compare columns feature with real AI:

```javascript
async function compareColumnsWithAI(notebook, columnIds) {
  const columns = notebook.columns.filter(col => columnIds.includes(col.id));
  
  // Build comprehensive context
  const comparisonData = notebook.rows.map(row => {
    const rowData = {};
    columns.forEach(col => {
      rowData[col.name] = row.cells[col.id] || '';
    });
    return rowData;
  });
  
  const prompt = `
Analyze and compare the following columns from a research notebook:
${columns.map(col => col.name).join(', ')}

Data:
${JSON.stringify(comparisonData, null, 2)}

Provide a detailed comparison including:
1. Key Similarities: Common themes and patterns
2. Key Differences: Notable variations and contrasts
3. Overall Assessment: High-level synthesis and insights

Be specific and reference actual data points.
`;
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a research analyst skilled at comparative analysis.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    max_tokens: 1000
  });
  
  return completion.choices[0].message.content;
}
```

## Cost Optimization

### 1. Caching Strategies

```javascript
const cache = new Map();

async function generateWithCache(prompt, context) {
  const cacheKey = `${prompt}:${context}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const response = await callAI(prompt, context);
  cache.set(cacheKey, response);
  
  // Expire cache after 1 hour
  setTimeout(() => cache.delete(cacheKey), 3600000);
  
  return response;
}
```

### 2. Model Selection Based on Task

```javascript
function selectModelForTask(prompt) {
  if (prompt.toLowerCase().includes('summarize')) {
    return 'gpt-3.5-turbo'; // Cheaper, good enough for summaries
  } else if (prompt.toLowerCase().includes('analyze') || 
             prompt.toLowerCase().includes('compare')) {
    return 'gpt-4-turbo-preview'; // Better reasoning for complex tasks
  }
  return 'gpt-3.5-turbo'; // Default to cheaper model
}
```

### 3. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each user to 50 AI requests per window
  message: 'Too many AI requests, please try again later.'
});

app.use('/api/notebooks/:id/ai/', aiLimiter);
```

## Error Handling

Robust error handling for production:

```javascript
async function generateAIResponsesWithRetry(prompt, notebook, columnId, maxRetries = 3) {
  const responses = [];
  
  for (const row of notebook.rows) {
    let retries = 0;
    let success = false;
    
    while (retries < maxRetries && !success) {
      try {
        const context = buildRowContext(row, notebook);
        const response = await callAI(prompt, context);
        responses.push(response);
        success = true;
      } catch (error) {
        retries++;
        
        if (error.status === 429) {
          // Rate limit - wait and retry
          await sleep(Math.pow(2, retries) * 1000);
        } else if (error.status >= 500) {
          // Server error - retry
          await sleep(1000);
        } else {
          // Client error - don't retry
          throw error;
        }
      }
    }
    
    if (!success) {
      responses.push('Error: Failed after multiple retries');
    }
  }
  
  return responses;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

## Testing AI Integration

### Unit Tests

```javascript
const { expect } = require('chai');
const sinon = require('sinon');

describe('AI Integration', () => {
  it('should generate responses for all rows', async () => {
    const mockNotebook = {
      rows: [
        { id: 'row-1', cells: { 'col-1': 'Test data' } }
      ]
    };
    
    const responses = await generateAIResponses('summarize', mockNotebook);
    
    expect(responses).to.have.lengthOf(1);
    expect(responses[0]).to.be.a('string');
  });
  
  it('should handle API errors gracefully', async () => {
    sinon.stub(openai.chat.completions, 'create').rejects(new Error('API Error'));
    
    const responses = await generateAIResponsesWithRetry('test', mockNotebook, 'col-1', 1);
    
    expect(responses[0]).to.include('Error');
  });
});
```

## Monitoring and Analytics

Track AI usage for optimization:

```javascript
const analytics = {
  totalRequests: 0,
  totalTokens: 0,
  averageResponseTime: 0,
  errorRate: 0
};

async function trackAICall(operation) {
  const startTime = Date.now();
  
  try {
    const result = await operation();
    
    analytics.totalRequests++;
    analytics.totalTokens += result.usage?.total_tokens || 0;
    analytics.averageResponseTime = 
      (analytics.averageResponseTime * (analytics.totalRequests - 1) + 
       (Date.now() - startTime)) / analytics.totalRequests;
    
    return result;
  } catch (error) {
    analytics.errorRate = (analytics.errorRate * analytics.totalRequests + 1) / 
                          (analytics.totalRequests + 1);
    throw error;
  }
}

app.get('/api/ai/analytics', (req, res) => {
  res.json(analytics);
});
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] API keys secured (not in code)
- [ ] Rate limiting implemented
- [ ] Error handling tested
- [ ] Caching strategy in place
- [ ] Cost monitoring enabled
- [ ] Retry logic implemented
- [ ] Logging configured
- [ ] Analytics tracking setup
- [ ] Load testing completed

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [Google AI Studio](https://ai.google.dev/)
- [Ollama Documentation](https://ollama.ai/docs)

---

**Next Steps**: Choose your AI provider, implement the integration, and test thoroughly before production deployment!
