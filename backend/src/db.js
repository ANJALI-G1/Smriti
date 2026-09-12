const { DatabaseSync } = require('node:sqlite');
const bcrypt = require('bcryptjs');
const path = require('node:path');
const fs = require('node:fs');

const dbPath = process.env.DB_PATH || './data/app.db';
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);
db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('patient', 'caregiver')),
    display_name TEXT NOT NULL
  );
`);

// Family members and memories a caregiver records for a patient. Both
// reference the existing `users` table (role='patient') rather than a
// separate patients concept, since that's the only patient model the
// project has. See architecture.md's Core Data Flow / implementation.md
// C-T1 for how this is expected to grow (routines, game_sessions, etc.).
db.exec(`
  CREATE TABLE IF NOT EXISTS family_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    relationship TEXT,
    photo_url TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS memories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL REFERENCES users(id),
    family_member_id INTEGER REFERENCES family_members(id),
    type TEXT NOT NULL CHECK (type IN ('photo', 'voice', 'place', 'song')),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

function seedUser({ username, password, role, display_name }) {
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) return existing.id;
  const password_hash = bcrypt.hashSync(password, 10);
  const result = db
    .prepare('INSERT INTO users (username, password_hash, role, display_name) VALUES (?, ?, ?, ?)')
    .run(username, password_hash, role, display_name);
  return Number(result.lastInsertRowid);
}

const aitonId = seedUser({ username: 'aiton', password: 'aiton123', role: 'patient', display_name: 'Aiton' });
seedUser({ username: 'caregiver', password: 'caregiver123', role: 'caregiver', display_name: 'Ban' });

// Seed a couple of demo memories so the dashboard isn't empty on first run —
// idempotent (only runs once, checked the same way seedUser is) and, unlike
// before, these are now real rows a caregiver could also edit/add alongside.
function seedMemories() {
  const existing = db.prepare('SELECT id FROM memories WHERE patient_id = ? LIMIT 1').get(aitonId);
  if (existing) return;

  const rina = db
    .prepare('INSERT INTO family_members (patient_id, name, relationship) VALUES (?, ?, ?)')
    .run(aitonId, 'Rina', 'Granddaughter');
  const rinaId = Number(rina.lastInsertRowid);

  db.prepare(
    'INSERT INTO memories (patient_id, family_member_id, type, title, description) VALUES (?, ?, ?, ?, ?)',
  ).run(aitonId, rinaId, 'photo', 'Rina', 'Granddaughter · Upper Shillong Orchard');

  db.prepare('INSERT INTO memories (patient_id, type, title, description) VALUES (?, ?, ?, ?)').run(
    aitonId,
    'place',
    'Wooden Veranda Garden',
    'Blooming orchids & pine hill mist — morning tea grounding memory',
  );

  db.prepare('INSERT INTO memories (patient_id, type, title, description) VALUES (?, ?, ?, ?)').run(
    aitonId,
    'song',
    'Autumn Harvest Song',
    'Khasi flute & family choir recording, activated during calm voice queries',
  );
}

seedMemories();

module.exports = db;
