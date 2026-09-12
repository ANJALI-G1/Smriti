const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { getFamilyMembersForPatient, getMemoriesForPatient } = require('../models/memories');

const router = express.Router();

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

module.exports = router;
