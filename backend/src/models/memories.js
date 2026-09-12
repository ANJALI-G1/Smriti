// Shared query helpers over the `family_members`/`memories` tables (see
// db.js). Both routes/caregiver.js (writes + caregiver-facing reads) and
// routes/patient.js (patient-facing reads) import from here rather than
// each defining their own copy of these queries against the same schema.
const db = require('../db');

// MVP has exactly one patient in the system. The caregiver routes resolve
// them this way so a caregiver's write is never taken from client input —
// see caregiver.js's /memories POST handler for how that's enforced. The
// patient routes don't need this at all: an authenticated patient's own
// `req.user.id` (from their verified JWT) already *is* their patient_id.
function getPatientUser() {
  return db.prepare("SELECT id, display_name FROM users WHERE role = 'patient' LIMIT 1").get();
}

const MEMORY_SELECT = `
  SELECT
     m.id, m.patient_id AS patientId, m.family_member_id AS familyMemberId,
     m.type, m.title, m.description, m.image_url AS imageUrl,
     m.created_at AS createdAt, m.updated_at AS updatedAt,
     fm.name AS familyMemberName, fm.relationship AS familyMemberRelationship,
     fm.photo_url AS familyMemberPhotoUrl
   FROM memories m
   LEFT JOIN family_members fm ON fm.id = m.family_member_id
`;

function getMemoryById(id) {
  return db.prepare(`${MEMORY_SELECT} WHERE m.id = ?`).get(id);
}

// Used before an update/delete to confirm the memory actually belongs to
// the caregiver's patient — the id in the URL is otherwise just a number
// anyone authenticated as *a* caregiver could guess.
function getMemoryOwnedByPatient(id, patientId) {
  return db.prepare(`${MEMORY_SELECT} WHERE m.id = ? AND m.patient_id = ?`).get(id, patientId);
}

function getMemoriesForPatient(patientId) {
  return db
    .prepare(`${MEMORY_SELECT} WHERE m.patient_id = ? ORDER BY m.created_at DESC, m.id DESC`)
    .all(patientId);
}

// The "people" a patient can be asked to recognize — one row per family
// member, newest first, independent of how many memories reference them.
// Ordered by id as well as created_at: SQLite's datetime('now') only has
// one-second resolution, so two rows created in the same request-handling
// second (very possible — e.g. a caregiver adding several people in a
// row) tie on created_at; `id DESC` breaks the tie deterministically by
// insertion order instead of leaving it up to SQLite's whim.
function getFamilyMembersForPatient(patientId) {
  return db
    .prepare(
      `SELECT
         id, patient_id AS patientId, name, relationship,
         photo_url AS photoUrl, created_at AS createdAt, updated_at AS updatedAt
       FROM family_members
       WHERE patient_id = ?
       ORDER BY created_at DESC, id DESC`,
    )
    .all(patientId);
}

function getFamilyMemberByName(patientId, name) {
  return db.prepare('SELECT * FROM family_members WHERE patient_id = ? AND name = ?').get(patientId, name);
}

function getFamilyMemberById(id) {
  return db.prepare('SELECT * FROM family_members WHERE id = ?').get(id);
}

function insertFamilyMember({ patientId, name, relationship, photoUrl }) {
  const result = db
    .prepare('INSERT INTO family_members (patient_id, name, relationship, photo_url) VALUES (?, ?, ?, ?)')
    .run(patientId, name, relationship ?? null, photoUrl ?? null);
  return Number(result.lastInsertRowid);
}

// Partial update — only columns present as keys in `fields` are touched,
// so callers don't have to re-supply values they aren't changing.
function updateFamilyMember(id, fields) {
  const columns = { name: 'name', relationship: 'relationship', photoUrl: 'photo_url' };
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
  db.prepare(`UPDATE family_members SET ${sets.join(', ')} WHERE id = ?`).run(...params);
}

function insertMemory({ patientId, familyMemberId, type, title, description, imageUrl }) {
  const result = db
    .prepare(
      'INSERT INTO memories (patient_id, family_member_id, type, title, description, image_url) VALUES (?, ?, ?, ?, ?, ?)',
    )
    .run(patientId, familyMemberId ?? null, type, title, description ?? null, imageUrl ?? null);
  return Number(result.lastInsertRowid);
}

// Same partial-update convention as updateFamilyMember.
function updateMemory(id, fields) {
  const columns = {
    familyMemberId: 'family_member_id',
    type: 'type',
    title: 'title',
    description: 'description',
    imageUrl: 'image_url',
  };
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
  db.prepare(`UPDATE memories SET ${sets.join(', ')} WHERE id = ?`).run(...params);
}

module.exports = {
  getPatientUser,
  getMemoryById,
  getMemoryOwnedByPatient,
  getMemoriesForPatient,
  getFamilyMembersForPatient,
  getFamilyMemberByName,
  getFamilyMemberById,
  insertFamilyMember,
  updateFamilyMember,
  insertMemory,
  updateMemory,
};
