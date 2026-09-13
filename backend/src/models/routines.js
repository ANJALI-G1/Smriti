// Query helpers over the `routines` and `routine_completions` tables (see
// db.js) — the caregiver's editable daily schedule for a patient, and
// which of today's items have actually been done. Mirrors the conventions
// in models/memories.js (camelCase SELECT aliases, an id+patientId-scoped
// "owned by" lookup for authorization, partial-update helper).
const db = require('../db');

const ROUTINE_SELECT = `
  SELECT id, patient_id AS patientId, time, title, detail,
         created_at AS createdAt, updated_at AS updatedAt
  FROM routines
`;

// Joins in whether each routine was completed on the given calendar day —
// `completed` is a plain boolean (SQLite/node:sqlite returns the CASE as
// 0/1, coerced here so callers never have to think about it) and
// `completedAt` is the real timestamp of that completion, or null.
const ROUTINE_WITH_COMPLETION_SELECT = `
  SELECT r.id, r.patient_id AS patientId, r.time, r.title, r.detail,
         r.created_at AS createdAt, r.updated_at AS updatedAt,
         CASE WHEN rc.id IS NULL THEN 0 ELSE 1 END AS completed,
         rc.completed_at AS completedAt
  FROM routines r
  LEFT JOIN routine_completions rc ON rc.routine_id = r.id AND rc.date = ?
`;

function mapCompletionRow(row) {
  if (!row) return row;
  return { ...row, completed: Boolean(row.completed) };
}

// Ordered by time-of-day (stored as 24-hour 'HH:MM', so lexicographic order
// is chronological order) — this is the routine's natural, only ordering;
// there's no separate manual sort position to maintain.
function getRoutinesForPatient(patientId) {
  return db.prepare(`${ROUTINE_SELECT} WHERE patient_id = ? ORDER BY time ASC, id ASC`).all(patientId);
}

// Same list, with each item's completion status for `date` joined in —
// this is what both the patient's "Today's Routine" view and the
// caregiver's dashboard actually render.
function getRoutinesWithCompletionForPatient(patientId, date) {
  return db
    .prepare(`${ROUTINE_WITH_COMPLETION_SELECT} WHERE r.patient_id = ? ORDER BY r.time ASC, r.id ASC`)
    .all(date, patientId)
    .map(mapCompletionRow);
}

// Used before any update/delete to confirm the routine item actually
// belongs to the caregiver's patient — same ownership convention as
// getMemoryOwnedByPatient/getFamilyMemberOwnedByPatient.
function getRoutineOwnedByPatient(id, patientId) {
  return db.prepare(`${ROUTINE_SELECT} WHERE id = ? AND patient_id = ?`).get(id, patientId);
}

// Same ownership scoping, but with `date`'s completion status joined in —
// used to build the response right after marking/unmarking completion.
function getRoutineWithCompletionOwnedByPatient(id, patientId, date) {
  return mapCompletionRow(
    db.prepare(`${ROUTINE_WITH_COMPLETION_SELECT} WHERE r.id = ? AND r.patient_id = ?`).get(date, id, patientId),
  );
}

function insertRoutine({ patientId, time, title, detail }) {
  const result = db
    .prepare('INSERT INTO routines (patient_id, time, title, detail) VALUES (?, ?, ?, ?)')
    .run(patientId, time, title, detail ?? null);
  return Number(result.lastInsertRowid);
}

// Partial update — only columns present as keys in `fields` are touched.
function updateRoutine(id, fields) {
  const columns = { time: 'time', title: 'title', detail: 'detail' };
  const sets = [];
  const params = [];
  for (const [key, column] of Object.entries(columns)) {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      sets.push(`${column} = ?`);
      params.push(fields[key]);
    }
  }
  if (sets.length === 0) return;
  sets.push("updated_at = datetime('now')");
  params.push(id);
  db.prepare(`UPDATE routines SET ${sets.join(', ')} WHERE id = ?`).run(...params);
}

// Deletes a routine and every completion ever recorded against it — the
// `routine_completions.routine_id` foreign key has no ON DELETE action, so
// with `PRAGMA foreign_keys = ON` (db.js) deleting the routine first would
// fail loudly rather than leave orphaned completion rows behind.
function deleteRoutine(id) {
  db.prepare('DELETE FROM routine_completions WHERE routine_id = ?').run(id);
  db.prepare('DELETE FROM routines WHERE id = ?').run(id);
}

// Idempotent by design (UNIQUE(routine_id, date) + INSERT OR IGNORE): a
// double-tap or a retried request never creates a second completion or
// errors, it just leaves the single row as-is.
function markRoutineComplete(routineId, patientId, date) {
  db.prepare('INSERT OR IGNORE INTO routine_completions (routine_id, patient_id, date) VALUES (?, ?, ?)').run(
    routineId,
    patientId,
    date,
  );
}

// Reverses a completion (e.g. a caregiver correcting a mistaken verify) —
// a no-op if it was never marked complete for that day.
function unmarkRoutineComplete(routineId, date) {
  db.prepare('DELETE FROM routine_completions WHERE routine_id = ? AND date = ?').run(routineId, date);
}

module.exports = {
  getRoutinesForPatient,
  getRoutinesWithCompletionForPatient,
  getRoutineOwnedByPatient,
  getRoutineWithCompletionOwnedByPatient,
  insertRoutine,
  updateRoutine,
  deleteRoutine,
  markRoutineComplete,
  unmarkRoutineComplete,
};
