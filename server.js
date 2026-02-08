const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory data store (in production, use a proper database)
let notebooks = {
  'default': {
    id: 'default',
    name: 'Research Notebook',
    columns: [
      { id: 'col-title', name: 'Note Title', order: 0, visible: true },
      { id: 'col-source', name: 'Source', order: 1, visible: true },
      { id: 'col-summary', name: 'Summary', order: 2, visible: true }
    ],
    rows: [
      {
        id: 'row-1',
        order: 0,
        cells: {
          'col-title': 'Market Analysis Q3',
          'col-source': 'Industry Report 2023',
          'col-summary': 'Strong growth in emerging markets with 15% YoY increase'
        }
      },
      {
        id: 'row-2',
        order: 1,
        cells: {
          'col-title': 'Competitive Landscape',
          'col-source': 'Competitor Analysis',
          'col-summary': 'Three major players dominate with 70% market share'
        }
      },
      {
        id: 'row-3',
        order: 2,
        cells: {
          'col-title': 'Customer Feedback',
          'col-source': 'Survey Results',
          'col-summary': 'High satisfaction scores (4.2/5) with improvement areas identified'
        }
      }
    ],
    sources: [
      { id: 'src-1', name: 'Industry Report 2023', content: 'Comprehensive market analysis showing strong growth trends...' },
      { id: 'src-2', name: 'Competitor Analysis', content: 'Detailed competitive positioning and market share data...' },
      { id: 'src-3', name: 'Survey Results', content: 'Customer satisfaction metrics and feedback analysis...' }
    ]
  }
};

// API Routes

// Get notebook
app.get('/api/notebooks/:id', (req, res) => {
  const notebook = notebooks[req.params.id];
  if (!notebook) {
    return res.status(404).json({ error: 'Notebook not found' });
  }
  res.json(notebook);
});

// Update notebook
app.put('/api/notebooks/:id', (req, res) => {
  const { id } = req.params;
  if (!notebooks[id]) {
    return res.status(404).json({ error: 'Notebook not found' });
  }
  notebooks[id] = { ...notebooks[id], ...req.body, id };
  res.json(notebooks[id]);
});

// Add column
app.post('/api/notebooks/:id/columns', (req, res) => {
  const notebook = notebooks[req.params.id];
  if (!notebook) {
    return res.status(404).json({ error: 'Notebook not found' });
  }
  
  const newColumn = {
    id: `col-${uuidv4()}`,
    name: req.body.name || `Column ${notebook.columns.length + 1}`,
    order: notebook.columns.length,
    visible: true
  };
  
  notebook.columns.push(newColumn);
  
  // Initialize cells for this column in all rows
  notebook.rows.forEach(row => {
    row.cells[newColumn.id] = '';
  });
  
  res.json(newColumn);
});

// Update column
app.put('/api/notebooks/:notebookId/columns/:columnId', (req, res) => {
  const notebook = notebooks[req.params.notebookId];
  if (!notebook) {
    return res.status(404).json({ error: 'Notebook not found' });
  }
  
  const columnIndex = notebook.columns.findIndex(col => col.id === req.params.columnId);
  if (columnIndex === -1) {
    return res.status(404).json({ error: 'Column not found' });
  }
  
  notebook.columns[columnIndex] = { ...notebook.columns[columnIndex], ...req.body };
  res.json(notebook.columns[columnIndex]);
});

// Delete column
app.delete('/api/notebooks/:notebookId/columns/:columnId', (req, res) => {
  const notebook = notebooks[req.params.notebookId];
  if (!notebook) {
    return res.status(404).json({ error: 'Notebook not found' });
  }
  
  const columnIndex = notebook.columns.findIndex(col => col.id === req.params.columnId);
  if (columnIndex === -1) {
    return res.status(404).json({ error: 'Column not found' });
  }
  
  const columnId = req.params.columnId;
  notebook.columns.splice(columnIndex, 1);
  
  // Remove cells for this column from all rows
  notebook.rows.forEach(row => {
    delete row.cells[columnId];
  });
  
  res.json({ success: true });
});

// Add row
app.post('/api/notebooks/:id/rows', (req, res) => {
  const notebook = notebooks[req.params.id];
  if (!notebook) {
    return res.status(404).json({ error: 'Notebook not found' });
  }
  
  const newRow = {
    id: `row-${uuidv4()}`,
    order: notebook.rows.length,
    cells: {}
  };
  
  // Initialize cells for all columns
  notebook.columns.forEach(col => {
    newRow.cells[col.id] = '';
  });
  
  notebook.rows.push(newRow);
  res.json(newRow);
});

// Update row
app.put('/api/notebooks/:notebookId/rows/:rowId', (req, res) => {
  const notebook = notebooks[req.params.notebookId];
  if (!notebook) {
    return res.status(404).json({ error: 'Notebook not found' });
  }
  
  const rowIndex = notebook.rows.findIndex(row => row.id === req.params.rowId);
  if (rowIndex === -1) {
    return res.status(404).json({ error: 'Row not found' });
  }
  
  notebook.rows[rowIndex] = { ...notebook.rows[rowIndex], ...req.body };
  res.json(notebook.rows[rowIndex]);
});

// Delete row
app.delete('/api/notebooks/:notebookId/rows/:rowId', (req, res) => {
  const notebook = notebooks[req.params.notebookId];
  if (!notebook) {
    return res.status(404).json({ error: 'Notebook not found' });
  }
  
  const rowIndex = notebook.rows.findIndex(row => row.id === req.params.rowId);
  if (rowIndex === -1) {
    return res.status(404).json({ error: 'Row not found' });
  }
  
  notebook.rows.splice(rowIndex, 1);
  res.json({ success: true });
});

// Update cell
app.put('/api/notebooks/:notebookId/cells/:rowId/:columnId', (req, res) => {
  const notebook = notebooks[req.params.notebookId];
  if (!notebook) {
    return res.status(404).json({ error: 'Notebook not found' });
  }
  
  const row = notebook.rows.find(r => r.id === req.params.rowId);
  if (!row) {
    return res.status(404).json({ error: 'Row not found' });
  }
  
  row.cells[req.params.columnId] = req.body.content;
  res.json({ content: req.body.content });
});

// AI Actions

// Fill column with AI
app.post('/api/notebooks/:id/ai/fill-column', (req, res) => {
  const { columnId, prompt } = req.body;
  const notebook = notebooks[req.params.id];
  
  if (!notebook) {
    return res.status(404).json({ error: 'Notebook not found' });
  }
  
  // Simulate AI generation (in production, integrate with actual AI service)
  const aiResponses = generateAIResponses(prompt, notebook.rows.length);
  
  notebook.rows.forEach((row, index) => {
    row.cells[columnId] = aiResponses[index];
  });
  
  res.json({ success: true, updatedRows: notebook.rows });
});

// Generate new column with AI
app.post('/api/notebooks/:id/ai/generate-column', (req, res) => {
  const { prompt } = req.body;
  const notebook = notebooks[req.params.id];
  
  if (!notebook) {
    return res.status(404).json({ error: 'Notebook not found' });
  }
  
  // Extract column name from prompt (simple heuristic)
  const columnName = extractColumnName(prompt);
  
  const newColumn = {
    id: `col-${uuidv4()}`,
    name: columnName,
    order: notebook.columns.length,
    visible: true
  };
  
  notebook.columns.push(newColumn);
  
  // Generate AI content for the new column
  const aiResponses = generateAIResponses(prompt, notebook.rows.length);
  
  notebook.rows.forEach((row, index) => {
    row.cells[newColumn.id] = aiResponses[index];
  });
  
  res.json({ column: newColumn, updatedRows: notebook.rows });
});

// Compare columns with AI
app.post('/api/notebooks/:id/ai/compare-columns', (req, res) => {
  const { columnIds } = req.body;
  const notebook = notebooks[req.params.id];
  
  if (!notebook) {
    return res.status(404).json({ error: 'Notebook not found' });
  }
  
  // Simulate AI comparison
  const comparison = generateComparison(notebook, columnIds);
  
  res.json({ comparison });
});

// Helper functions for AI simulation

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

function extractColumnName(prompt) {
  // Simple heuristic to extract column name from prompt
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('tone')) return 'Tone';
  if (lowerPrompt.includes('sentiment')) return 'Sentiment';
  if (lowerPrompt.includes('key points')) return 'Key Points';
  if (lowerPrompt.includes('evidence')) return 'Evidence';
  if (lowerPrompt.includes('quotes')) return 'Quotes';
  if (lowerPrompt.includes('methodology')) return 'Methodology';
  
  return 'AI Generated Column';
}

function generateComparison(notebook, columnIds) {
  const columns = notebook.columns.filter(col => columnIds.includes(col.id));
  const columnNames = columns.map(col => col.name).join(' and ');
  
  return `Comparison of ${columnNames}:\n\nKey Similarities:\n- Common themes across sources\n- Consistent data points\n- Aligned perspectives\n\nKey Differences:\n- Varying emphasis on specific aspects\n- Different methodological approaches\n- Contrasting conclusions in some areas\n\nOverall Assessment: The columns show strong alignment on core concepts with notable variations in implementation details.`;
}

// Serve the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Notebook LM Columns server running on port ${PORT}`);
  console.log(`Access the app at http://localhost:${PORT}`);
});
