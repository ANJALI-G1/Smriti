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
     m.type, m.title, m.description, m.image_url AS imageUrl, m.audio_url AS audioUrl,
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

const FAMILY_MEMBER_SELECT = `
  SELECT
     fm.id, fm.patient_id AS patientId, fm.name, fm.relationship,
     fm.photo_url AS photoUrl, fm.created_at AS createdAt, fm.updated_at AS updatedAt,
     (SELECT COUNT(*) FROM memories m WHERE m.family_member_id = fm.id) AS memoryCount
   FROM family_members fm
`;

// The "people" a patient can be asked to recognize — one row per family
// member, newest first, independent of how many memories reference them.
// Ordered by id as well as created_at: SQLite's datetime('now') only has
// one-second resolution, so two rows created in the same request-handling
// second (very possible — e.g. a caregiver adding several people in a
// row) tie on created_at; `id DESC` breaks the tie deterministically by
// insertion order instead of leaving it up to SQLite's whim.
function getFamilyMembersForPatient(patientId) {
  return db
    .prepare(`${FAMILY_MEMBER_SELECT} WHERE fm.patient_id = ? ORDER BY fm.created_at DESC, fm.id DESC`)
    .all(patientId);
}

// Used before any family-member update/delete to confirm the row actually
// belongs to the caregiver's patient — same ownership convention as
// getMemoryOwnedByPatient above. This (an id-scoped lookup) is deliberately
// the *only* way a request can target an existing family member: there is
// no name-based lookup anymore, since matching people by typed display name
// is exactly what let a caregiver accidentally create duplicate/orphaned
// rows (two "Rina"s, or a rename that silently forked a new person).
function getFamilyMemberOwnedByPatient(id, patientId) {
  return db.prepare(`${FAMILY_MEMBER_SELECT} WHERE fm.id = ? AND fm.patient_id = ?`).get(id, patientId);
}

// Unscoped lookup for internal use only, when the id has already been
// established to belong to the current patient via some other owned row
// (e.g. a memory's own family_member_id, after the memory itself was
// confirmed owned) — never for use directly against client-supplied input.
function getFamilyMemberById(id) {
  return db.prepare(`${FAMILY_MEMBER_SELECT} WHERE fm.id = ?`).get(id);
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

// Deletes a family member outright. Callers must first detach any memories
// that still reference this id (see nullifyFamilyMemberOnMemories) — the
// `memories.family_member_id` foreign key has no ON DELETE action, so with
// `PRAGMA foreign_keys = ON` (db.js) a delete while references remain would
// fail loudly rather than leave anything orphaned.
function deleteFamilyMember(id) {
  db.prepare('DELETE FROM family_members WHERE id = ?').run(id);
}

// Detaches every memory currently pointing at this family member (sets
// family_member_id to NULL) without touching the memory's own title/
// description — a memory survives its person being removed, it just stops
// being "about" anyone in particular. Always call this before
// deleteFamilyMember for the same id.
function nullifyFamilyMemberOnMemories(familyMemberId) {
  db.prepare("UPDATE memories SET family_member_id = NULL, updated_at = datetime('now') WHERE family_member_id = ?").run(
    familyMemberId,
  );
}

function insertMemory({ patientId, familyMemberId, type, title, description, imageUrl, audioUrl }) {
  const result = db
    .prepare(
      'INSERT INTO memories (patient_id, family_member_id, type, title, description, image_url, audio_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
    )
    .run(patientId, familyMemberId ?? null, type, title, description ?? null, imageUrl ?? null, audioUrl ?? null);
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
    audioUrl: 'audio_url',
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

function deleteMemory(id) {
  db.prepare('DELETE FROM memories WHERE id = ?').run(id);
}

module.exports = {
  getPatientUser,
  getMemoryById,
  getMemoryOwnedByPatient,
  getMemoriesForPatient,
  getFamilyMembersForPatient,
  getFamilyMemberOwnedByPatient,
  getFamilyMemberById,
  insertFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
  nullifyFamilyMemberOnMemories,
  insertMemory,
  updateMemory,
  deleteMemory,
};
