const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { getFamilyMembersForPatient, getMemoriesForPatient } = require('../models/memories');
const {
  getRoutinesWithCompletionForPatient,
  getRoutineOwnedByPatient,
  getRoutineWithCompletionOwnedByPatient,
  markRoutineComplete,
} = require('../models/routines');
const { getEnabledActivitiesForPatient, isValidActivityType, recordActivityCompletion } = require('../models/activities');

const router = express.Router();

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/; // 'YYYY-MM-DD', the caller's own local calendar day

router.get('/home', requireAuth, requireRole('patient'), (req, res) => {
  res.json({ message: `Welcome back, ${req.user.displayName}.` });
});

// The authenticated patient's own id IS their patient_id — there is no
// patientId to accept from the client here, which is what makes "a patient
// can't read another patient's memories by changing a parameter" true by
// construction rather than by an extra check we could forget to add.
router.get('/memories', requireAuth, requireRole('patient'), (req, res) => {
  const patientId = req.user.id;
  res.json({
    familyMembers: getFamilyMembersForPatient(patientId),
    memories: getMemoriesForPatient(patientId),
  });
});

// `date` must be the patient's own local calendar day, supplied by the
// client (see frontend/src/utils/formatDate.js's getLocalDateString) —
// the server never guesses "today" from its own clock/timezone, since
// that could disagree with the patient's actual wall-clock day.
router.get('/routines', requireAuth, requireRole('patient'), (req, res) => {
  const date = req.query.date;
  if (!DATE_PATTERN.test(date || '')) {
    return res.status(400).json({ error: 'date must be in YYYY-MM-DD format.' });
  }
  res.json({ routines: getRoutinesWithCompletionForPatient(req.user.id, date) });
});

// A patient marking their own routine item done — ownership is enforced
// by scoping the lookup to req.user.id (their own verified identity),
// never a client-supplied patientId, same convention as GET /memories
// above. Writes to the exact same routine_completions row the caregiver's
// own "verify" action would (see routes/caregiver.js) — one shared source
// of truth, not two.
router.post('/routines/:id/complete', requireAuth, requireRole('patient'), (req, res) => {
  const routineId = Number(req.params.id);
  const existing = getRoutineOwnedByPatient(routineId, req.user.id);
  if (!existing) {
    return res.status(404).json({ error: 'Routine item not found.' });
  }

  const { date } = req.body || {};
  if (!DATE_PATTERN.test(date || '')) {
    return res.status(400).json({ error: 'date must be in YYYY-MM-DD format.' });
  }

  markRoutineComplete(routineId, req.user.id, date);
  res.json({ routine: getRoutineWithCompletionOwnedByPatient(routineId, req.user.id, date) });
});

// The common Activities/Games catalog, filtered to whatever this patient
// (or their caregiver) has enabled — the games' actual content is never
// computed here, only which ones this patient is allowed to see; the
// frontend builds each game's personalized content itself from the
// memories/family-members this same patient already fetched.
router.get('/activities', requireAuth, requireRole('patient'), (req, res) => {
  res.json({ activities: getEnabledActivitiesForPatient(req.user.id) });
});

// A patient finishing a round of a game — no score, just "this happened
// today." `type` is checked against the fixed catalog, not trusted
// free-form, so this table can never accumulate junk activity types.
router.post('/activities/:type/complete', requireAuth, requireRole('patient'), (req, res) => {
  const { type } = req.params;
  if (!isValidActivityType(type)) {
    return res.status(404).json({ error: 'Unknown activity.' });
  }

  const { date } = req.body || {};
  if (!DATE_PATTERN.test(date || '')) {
    return res.status(400).json({ error: 'date must be in YYYY-MM-DD format.' });
  }

  recordActivityCompletion(req.user.id, type, date);
  res.status(201).json({ success: true });
});

module.exports = router;
