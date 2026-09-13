// The common Activities/Games library — one static definition per game
// type, shared by every patient (see db.js's comment on activity_settings
// for why this lives in code rather than a DB table). A patient's actual
// game *content* (which family photo, which place, which song) is never
// stored here — the frontend builds it at play time from the patient's
// own already-authorized memories/family-members data (GET
// /api/patient/memories), so there is nothing patient-specific to leak
// here and nothing to keep in sync across patients.
//
// Every game is deliberately gentle: no timers, no scores, no "wrong"
// feedback, unlimited retries — see the frontend game components under
// frontend/src/components/patient/activities/games for the actual
// interactions these definitions describe.
const db = require('../db');

const ACTIVITY_CATALOG = [
  {
    type: 'who_is_this',
    title: 'People I Know',
    icon: 'face',
    category: 'Recognition',
    difficulty: 'Gentle',
    durationLabel: '2-3 min',
    instructions: "See a familiar face and choose the name that feels right — there's no wrong answer, just a gentle guess.",
    usesPersonalData: 'family member photos',
  },
  {
    type: 'familiar_places',
    title: 'Familiar Places',
    icon: 'deck',
    category: 'Reminiscence',
    difficulty: 'Gentle',
    durationLabel: '2-3 min',
    instructions: 'A quiet look at places from your life, and a moment to remember them.',
    usesPersonalData: 'saved place memories',
  },
  {
    type: 'music_memory',
    title: 'Music Memory',
    icon: 'music',
    category: 'Reminiscence',
    difficulty: 'Gentle',
    durationLabel: '2-3 min',
    instructions: 'Listen to a familiar recording and share how it makes you feel.',
    usesPersonalData: 'saved voice/song memories',
  },
  {
    type: 'remember_picture',
    title: 'Remember the Picture',
    icon: 'spa',
    category: 'Recognition',
    difficulty: 'Gentle',
    durationLabel: '2-3 min',
    instructions: 'Look closely at a picture, then find the one you saw among a few choices.',
    usesPersonalData: 'photo memories, when available',
  },
  {
    type: 'match_pictures',
    title: 'Match Pictures',
    icon: 'checkCircle',
    category: 'Matching',
    difficulty: 'Gentle',
    durationLabel: '3-5 min',
    instructions: 'Turn over cards and find the matching pairs — take all the time you need.',
    usesPersonalData: 'family photos, when available',
  },
  {
    type: 'familiar_things',
    title: 'Familiar Things',
    icon: 'leaf',
    category: 'Recognition',
    difficulty: 'Gentle',
    durationLabel: '2-3 min',
    instructions: 'Everyday fruits, animals, and objects to recognize together.',
    usesPersonalData: null,
  },
  {
    type: 'lets_talk',
    title: "Let's Talk",
    icon: 'heart',
    category: 'Conversation',
    difficulty: 'Gentle',
    durationLabel: 'Open-ended',
    instructions: 'A memory to look at and talk about with family — no right or wrong, just conversation.',
    usesPersonalData: 'any saved memory',
  },
];

const ACTIVITY_TYPES = ACTIVITY_CATALOG.map((activity) => activity.type);

function isValidActivityType(type) {
  return ACTIVITY_TYPES.includes(type);
}

// Every patient sees the full catalog with an `enabled` flag — a missing
// activity_settings row means "never touched by a caregiver," which
// defaults to enabled so a newly-added game type in the catalog doesn't
// require a migration to switch it on for existing patients.
function getActivitySettingsForPatient(patientId) {
  const rows = db
    .prepare('SELECT activity_type AS activityType, enabled FROM activity_settings WHERE patient_id = ?')
    .all(patientId);
  const overrides = new Map(rows.map((row) => [row.activityType, Boolean(row.enabled)]));
  return ACTIVITY_CATALOG.map((activity) => ({
    ...activity,
    enabled: overrides.has(activity.type) ? overrides.get(activity.type) : true,
  }));
}

function getEnabledActivitiesForPatient(patientId) {
  return getActivitySettingsForPatient(patientId).filter((activity) => activity.enabled);
}

function setActivityEnabled(patientId, activityType, enabled) {
  const existing = db
    .prepare('SELECT id FROM activity_settings WHERE patient_id = ? AND activity_type = ?')
    .get(patientId, activityType);
  if (existing) {
    db.prepare("UPDATE activity_settings SET enabled = ?, updated_at = datetime('now') WHERE id = ?").run(
      enabled ? 1 : 0,
      existing.id,
    );
  } else {
    db.prepare('INSERT INTO activity_settings (patient_id, activity_type, enabled) VALUES (?, ?, ?)').run(
      patientId,
      activityType,
      enabled ? 1 : 0,
    );
  }
}

// No score, no attempt count — just "a round of this game was finished,
// on this day." See db.js's comment on activity_completions.
function recordActivityCompletion(patientId, activityType, date) {
  db.prepare('INSERT INTO activity_completions (patient_id, activity_type, date) VALUES (?, ?, ?)').run(
    patientId,
    activityType,
    date,
  );
}

function getActivityCompletionCountForPatient(patientId, date) {
  const row = db
    .prepare('SELECT COUNT(*) AS count FROM activity_completions WHERE patient_id = ? AND date = ?')
    .get(patientId, date);
  return row ? row.count : 0;
}

module.exports = {
  ACTIVITY_CATALOG,
  isValidActivityType,
  getActivitySettingsForPatient,
  getEnabledActivitiesForPatient,
  setActivityEnabled,
  recordActivityCompletion,
  getActivityCompletionCountForPatient,
};
