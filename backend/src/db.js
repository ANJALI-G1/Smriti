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
    audio_url TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS routines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL REFERENCES users(id),
    time TEXT NOT NULL,
    title TEXT NOT NULL,
    detail TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- A routine definition ("Take medicine at 9:00 AM") is a recurring daily
  -- template; completing it on a given day is a separate fact. One row
  -- per (routine, calendar day) actually completed - no row means
  -- "not done yet" for that day, so nothing here ever needs resetting
  -- overnight. The date column is the LOCAL calendar day ('YYYY-MM-DD') of
  -- whoever marked it done, supplied by the client rather than computed
  -- from the server's clock - see routes/patient.js and
  -- routes/caregiver.js for why (the server's own timezone would
  -- otherwise risk a completion landing on the wrong day near midnight).
  CREATE TABLE IF NOT EXISTS routine_completions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    routine_id INTEGER NOT NULL REFERENCES routines(id),
    patient_id INTEGER NOT NULL REFERENCES users(id),
    date TEXT NOT NULL,
    completed_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (routine_id, date)
  );

  -- The Activities/Games *definitions* (title, instructions, category,
  -- icon, game logic) are a common library shared by every patient and
  -- live in code, not here (see models/activities.js's ACTIVITY_CATALOG)
  -- — there is deliberately no per-patient copy of "Who Is This?" to keep
  -- in sync. Only the two things that genuinely differ per patient are
  -- persisted: whether a given activity is turned on for them, and a
  -- light log of when they finished a round of one.
  CREATE TABLE IF NOT EXISTS activity_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL REFERENCES users(id),
    activity_type TEXT NOT NULL,
    enabled INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (patient_id, activity_type)
  );

  -- One row per finished round of a game - no score, no right/wrong
  -- count, just "this happened" (see requirements: light progress like
  -- "completed 3 activities today", never a percentage/score). The date
  -- column is the LOCAL calendar day of whoever completed it, same
  -- client-supplied convention as routine_completions.date, used only
  -- for the "today" count; completed_at is a real server timestamp for
  -- ordering a recent-activity view.
  CREATE TABLE IF NOT EXISTS activity_completions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL REFERENCES users(id),
    activity_type TEXT NOT NULL,
    date TEXT NOT NULL,
    completed_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// `CREATE TABLE IF NOT EXISTS` above is a no-op against a database file
// that already has an older `memories` table (from before audio memories
// existed), so a fresh column has to be migrated in separately for it to
// show up on an existing install. Safe to run on every boot: it only acts
// when the column is actually missing.
function ensureColumn(table, column, definition) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all();
  if (!columns.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}
ensureColumn('memories', 'audio_url', 'TEXT');

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

// Seed the same daily schedule that used to be hardcoded in
// caregiver.js's mock dashboard payload, now as real, caregiver-editable
// rows — idempotent the same way seedMemories is. `time` is stored as
// 24-hour 'HH:MM' so `ORDER BY time` sorts the day correctly; the frontend
// formats it for display (see frontend/src/utils/formatDate.js).
function seedRoutines() {
  const existing = db.prepare('SELECT id FROM routines WHERE patient_id = ? LIMIT 1').get(aitonId);
  if (existing) return;

  const items = [
    ['08:00', 'Morning Tea & Breakfast', 'Ginger tea with roasted rice cake'],
    ['10:30', 'Memory Recall Game', "Granddaughter Rina's orchard photo match"],
    ['13:00', 'Mid-day Meal & Rest', 'Rest on veranda cane chair'],
    ['14:00', 'Afternoon Medicine & Warm Tea', 'Taken with daughter-in-law Ban'],
    ['19:30', 'Evening Blood Pressure Medicine', 'Chime plays on tablet after dinner'],
  ];

  const insert = db.prepare('INSERT INTO routines (patient_id, time, title, detail) VALUES (?, ?, ?, ?)');
  for (const [time, title, detail] of items) {
    insert.run(aitonId, time, title, detail);
  }
}

seedRoutines();

module.exports = db;
