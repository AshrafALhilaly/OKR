const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../okr.db'));

function initDatabase() {
  // Create objectives table
  db.exec(`
    CREATE TABLE IF NOT EXISTS objectives (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      start_date TEXT,
      end_date TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create key_results table
  db.exec(`
    CREATE TABLE IF NOT EXISTS key_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      objective_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      target_value REAL NOT NULL,
      current_value REAL DEFAULT 0,
      unit TEXT,
      status TEXT DEFAULT 'in_progress',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (objective_id) REFERENCES objectives (id) ON DELETE CASCADE
    )
  `);

  console.log('Database initialized successfully');
}

// Objectives
function getObjectives() {
  const stmt = db.prepare(`
    SELECT o.*, 
           COUNT(kr.id) as key_results_count,
           AVG(CASE WHEN kr.target_value > 0 THEN (kr.current_value * 100.0 / kr.target_value) ELSE 0 END) as progress
    FROM objectives o
    LEFT JOIN key_results kr ON o.id = kr.objective_id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `);
  return stmt.all();
}

function createObjective(title, description, startDate, endDate) {
  const stmt = db.prepare(`
    INSERT INTO objectives (title, description, start_date, end_date)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(title, description, startDate, endDate);
  return { id: result.lastInsertRowid, title, description, startDate, endDate };
}

function updateObjective(id, title, description, startDate, endDate, status) {
  const stmt = db.prepare(`
    UPDATE objectives
    SET title = ?, description = ?, start_date = ?, end_date = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(title, description, startDate, endDate, status, id);
}

function deleteObjective(id) {
  const stmt = db.prepare('DELETE FROM objectives WHERE id = ?');
  stmt.run(id);
}

// Key Results
function getKeyResults(objectiveId) {
  const stmt = db.prepare(`
    SELECT * FROM key_results
    WHERE objective_id = ?
    ORDER BY created_at ASC
  `);
  return stmt.all(objectiveId);
}

function createKeyResult(objectiveId, title, targetValue, currentValue, unit) {
  const stmt = db.prepare(`
    INSERT INTO key_results (objective_id, title, target_value, current_value, unit)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(objectiveId, title, targetValue, currentValue || 0, unit);
  return { id: result.lastInsertRowid, objectiveId, title, targetValue, currentValue: currentValue || 0, unit };
}

function updateKeyResult(id, title, targetValue, currentValue, unit, status) {
  const stmt = db.prepare(`
    UPDATE key_results
    SET title = ?, target_value = ?, current_value = ?, unit = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(title, targetValue, currentValue, unit, status, id);
}

function deleteKeyResult(id) {
  const stmt = db.prepare('DELETE FROM key_results WHERE id = ?');
  stmt.run(id);
}

module.exports = {
  initDatabase,
  getObjectives,
  createObjective,
  updateObjective,
  deleteObjective,
  getKeyResults,
  createKeyResult,
  updateKeyResult,
  deleteKeyResult,
};
