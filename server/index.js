const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initDatabase, getObjectives, createObjective, updateObjective, deleteObjective, getKeyResults, createKeyResult, updateKeyResult, deleteKeyResult } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize database
initDatabase();

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'OKR Platform API is running' });
});

// Objectives
app.get('/api/objectives', (req, res) => {
  try {
    const objectives = getObjectives();
    res.json(objectives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/objectives', (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    const objective = createObjective(title, description, startDate, endDate);
    res.status(201).json(objective);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/objectives/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startDate, endDate, status } = req.body;
    updateObjective(id, title, description, startDate, endDate, status);
    res.json({ message: 'Objective updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/objectives/:id', (req, res) => {
  try {
    const { id } = req.params;
    deleteObjective(id);
    res.json({ message: 'Objective deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Key Results
app.get('/api/objectives/:objectiveId/keyresults', (req, res) => {
  try {
    const { objectiveId } = req.params;
    const keyResults = getKeyResults(objectiveId);
    res.json(keyResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/objectives/:objectiveId/keyresults', (req, res) => {
  try {
    const { objectiveId } = req.params;
    const { title, targetValue, currentValue, unit } = req.body;
    const keyResult = createKeyResult(objectiveId, title, targetValue, currentValue, unit);
    res.status(201).json(keyResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/keyresults/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, targetValue, currentValue, unit, status } = req.body;
    updateKeyResult(id, title, targetValue, currentValue, unit, status);
    res.json({ message: 'Key result updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/keyresults/:id', (req, res) => {
  try {
    const { id } = req.params;
    deleteKeyResult(id);
    res.json({ message: 'Key result deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
