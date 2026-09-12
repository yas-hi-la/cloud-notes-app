const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const path = require('path');

app.use(cors());
app.use(express.json());

const Database = require('better-sqlite3');
const db = new Database('notes.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT
  )
`);

app.get('/notes', (req, res) => {
  const notes = db.prepare('SELECT * FROM notes').all();
  res.json(notes);
});

app.post('/notes', (req, res) => {
  const stmt = db.prepare('INSERT INTO notes (text) VALUES (?)');
  const result = stmt.run(req.body.text);
  const newNote = { id: result.lastInsertRowid, text: req.body.text };
  res.json(newNote);
});

app.put('/notes/:id', (req, res) => {
  const stmt = db.prepare('UPDATE notes SET text = ? WHERE id = ?');
  stmt.run(req.body.text, req.params.id);
  const updatedNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(req.params.id);
  res.json(updatedNote);
});

app.delete('/notes/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
  stmt.run(req.params.id);
  res.json({ message: 'Note deleted', id: req.params.id });
});

app.use(express.static(path.join(__dirname, '../frontend'))); 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});