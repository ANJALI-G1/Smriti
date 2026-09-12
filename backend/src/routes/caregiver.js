const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { upload, publicUrlFor, deleteUploadedFile } = require('../middleware/upload');
const {
  getPatientUser,
  getMemoryById,
  getMemoryOwnedByPatient,
  getMemoriesForPatient,
  getFamilyMemberByName,
  insertFamilyMember,
  updateFamilyMember,
  insertMemory,
  updateMemory,
} = require('../models/memories');

const router = express.Router();

const MEMORY_TYPES = ['photo', 'voice', 'place', 'song'];
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_NAME_LENGTH = 200;
const MAX_RELATIONSHIP_LENGTH = 100;

function trimmedOrNull(value, maxLength) {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') return undefined; // signals "invalid type" to the caller
  return value.trim().slice(0, maxLength) || null;
}

// A single image field arrives as either a real uploaded file (multipart,
// via multer's req.file) or as a "remove it" instruction (a plain
// `removeImage` flag on a JSON or form body) or as "leave it alone"
// (neither present). This never trusts a client-supplied image *URL* —
// the only way an image_url/photo_url value reaches the database is by
// the server generating it from an actual uploaded file.
function readImageInstruction(req) {
  if (req.file) return { action: 'set', url: publicUrlFor(req.file.filename) };
  const removeImage = req.body?.removeImage;
  if (removeImage === true || removeImage === 'true') return { action: 'clear' };
  return { action: 'none' };
}

// Seeded/mock payload for everything the dashboard shows EXCEPT memories,
// which now come from the real `memories`/`family_members` tables (see
// db.js and the /memories routes below). The rest is still static — see
// implementation.md Phase 2 (C-T1–C-T4) for what would back these for real.
function getAitonDashboard(memories) {
  return {
    patient: {
      id: 1,
      name: 'Aiton',
      age: 74,
      relationship: 'Mother-in-law',
      location: 'Upper Shillong, Meghalaya',
      status: 'active',
      statusNote: 'Doing well this morning',
    },
    caregiver: {
      name: 'Ban',
      relationship: 'Daughter-in-law',
    },
    patients: [
      { id: 1, name: 'Aiton', age: 74, relationship: 'Mother-in-law', status: 'active', statusNote: 'Active today' },
      { id: 2, name: 'Maya', age: 69, relationship: 'Mother', status: 'idle', statusNote: 'Active yesterday' },
      { id: 3, name: 'Biren', age: 76, relationship: 'Father', status: 'attention', statusNote: 'No activity 4 days' },
    ],
    todayStats: [
      {
        key: 'engagement',
        label: 'Engagement',
        value: '18 min',
        valueSuffix: 'Today',
        detail: '2 activities completed',
        note: 'Morning memory game + photo recall',
      },
      {
        key: 'routine',
        label: 'Daily Routine',
        value: '4 / 5',
        valueSuffix: 'Completed',
        detail: '1 reminder missed',
        note: 'Evening medicine pending check-in',
        warning: true,
      },
      {
        key: 'memory',
        label: 'Memory Practice',
        value: 'Steady',
        valueSuffix: 'Pattern',
        detail: 'Warm recognition preserved',
        note: "Responded well to Rina's photo clue",
      },
      {
        key: 'mood',
        label: 'Emotional Tone',
        value: 'Calm',
        valueSuffix: 'Check-in',
        detail: '0 signs of agitation',
        note: 'Last voice interaction 1h ago',
      },
    ],
    attentionItems: [
      {
        id: 'evening-med',
        title: 'Evening medicine was missed.',
        scheduledFor: '7:30 PM',
        whatHappened: 'The tablet played the tea chime at 7:30 PM, but Aiton did not tap "Mark as Done".',
        whyItMatters: 'Her blood pressure medicine is typically taken with warm water after dinner.',
        suggestedAction: 'Consider calling her on the landline or checking in with her when she is sitting in the veranda.',
      },
    ],
    aiInsight: {
      headline: 'Word recall has been slightly lower for the past two weeks.',
      windowLabel: '14-day trend window',
      detail:
        'During family identification games, Aiton paused an average of 14 seconds longer before naming modern items, though her recognition of traditional Khasi words and grandchildren’s photos remained intact.',
      guardrail: 'This is a gentle pattern to keep an eye on, not a diagnosis.',
      suggestedAction:
        'Consider mentioning this subtle trend at the next regular clinic visit or CHW check-in. SMRITI can export a quiet summary for Dr. Lyngdoh.',
    },
    routineTimeline: [
      { time: '8:00 AM', title: 'Morning Tea & Breakfast', detail: 'Ginger tea with roasted rice cake', status: 'done' },
      { time: '10:30 AM', title: 'Memory Recall Game', detail: "Granddaughter Rina's orchard photo match", status: 'done' },
      { time: '1:00 PM', title: 'Mid-day Meal & Rest', detail: 'Rest on veranda cane chair', status: 'done' },
      { time: '2:00 PM', title: 'Afternoon Medicine & Warm Tea', detail: 'Taken with daughter-in-law Ban', status: 'done' },
      {
        time: '7:30 PM',
        title: 'Evening Blood Pressure Medicine',
        detail: 'Chime played on tablet · Not acknowledged',
        status: 'missed',
      },
    ],
    todayActivity: {
      type: 'Memory Recall',
      durationLabel: '3 min session',
      title: "Family Photo Match · Rina's Orchard Walk",
      description: "Personalized from Aiton's family album in Upper Shillong.",
      outcome: 'Comfortably Engaged',
      completedAt: '10:48 AM',
    },
    cognitiveTrends: [
      { key: 'memory', label: 'Memory', sublabel: 'Gentle clues', status: 'steady', statusLabel: 'STEADY', note: 'Consistent' },
      { key: 'attention', label: 'Attention', sublabel: 'Focus window', status: 'improving', statusLabel: '↑ IMPROVING', note: '18 min focus' },
      { key: 'recognition', label: 'Recognition', sublabel: 'Family faces', status: 'steady', statusLabel: 'STEADY', note: '96% with clues' },
      { key: 'sequencing', label: 'Sequencing', sublabel: 'Tea & routine', status: 'practising', statusLabel: 'PRACTISING', note: '5/5 days routine' },
      { key: 'language', label: 'Language', sublabel: 'Word finding', status: 'down', statusLabel: '↓ SLIGHTLY DOWN', note: 'Khasi strong' },
    ],
    memories,
    deviceLedger: '#ML-SHL-74A',
  };
}

router.get('/dashboard', requireAuth, requireRole('caregiver'), (_req, res) => {
  const patient = getPatientUser();
  const memories = patient ? getMemoriesForPatient(patient.id) : [];
  res.json(getAitonDashboard(memories));
});

router.get('/memories', requireAuth, requireRole('caregiver'), (_req, res) => {
  const patient = getPatientUser();
  if (!patient) {
    return res.status(404).json({ error: 'No patient is set up on this system yet.' });
  }
  res.json({ memories: getMemoriesForPatient(patient.id) });
});

// Wraps multer so its errors (file too large, bad type, etc.) become the
// same JSON error shape as the rest of the API instead of an HTML crash page.
function handleUpload(req, res, next) {
  upload.single('image')(req, res, (err) => {
    if (!err) return next();
    if (err.message === 'UNSUPPORTED_IMAGE_TYPE') {
      return res.status(400).json({ error: 'Image must be a JPEG, PNG, or WebP file.' });
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Image must be 5MB or smaller.' });
    }
    return res.status(400).json({ error: 'Could not process the uploaded image.' });
  });
}

router.post('/memories', requireAuth, requireRole('caregiver'), handleUpload, (req, res) => {
  const patient = getPatientUser();
  if (!patient) {
    return res.status(404).json({ error: 'No patient is set up on this system yet.' });
  }

  const { patientId, type, name, relationship, title, description } = req.body || {};

  // A caller may only ever address the one patient this caregiver actually
  // has — if they name a different one explicitly, refuse rather than
  // silently redirecting the write.
  if (patientId !== undefined && patientId !== null && Number(patientId) !== patient.id) {
    return res.status(403).json({ error: 'You are not authorized to add memories for that patient.' });
  }

  if (typeof type !== 'string' || !MEMORY_TYPES.includes(type)) {
    return res.status(400).json({ error: `type must be one of: ${MEMORY_TYPES.join(', ')}` });
  }

  const trimmedTitle = typeof title === 'string' ? title.trim() : '';
  if (!trimmedTitle) {
    return res.status(400).json({ error: 'title is required.' });
  }
  if (trimmedTitle.length > MAX_TITLE_LENGTH) {
    return res.status(400).json({ error: `title must be ${MAX_TITLE_LENGTH} characters or fewer.` });
  }

  const trimmedDescription = trimmedOrNull(description, MAX_DESCRIPTION_LENGTH);
  if (trimmedDescription === undefined) {
    return res.status(400).json({ error: 'description must be text.' });
  }

  const imageInstruction = readImageInstruction(req);
  const uploadedImageUrl = imageInstruction.action === 'set' ? imageInstruction.url : null;

  let familyMemberId = null;
  if (type === 'photo') {
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    if (!trimmedName) {
      if (uploadedImageUrl) deleteUploadedFile(uploadedImageUrl); // don't leave an orphaned file on a rejected request
      return res.status(400).json({ error: "A family member's name is required for a photo memory." });
    }
    if (trimmedName.length > MAX_NAME_LENGTH) {
      if (uploadedImageUrl) deleteUploadedFile(uploadedImageUrl);
      return res.status(400).json({ error: `name must be ${MAX_NAME_LENGTH} characters or fewer.` });
    }
    const trimmedRelationship = trimmedOrNull(relationship, MAX_RELATIONSHIP_LENGTH);

    const existingMember = getFamilyMemberByName(patient.id, trimmedName);
    if (existingMember) {
      familyMemberId = existingMember.id;
      const fields = {};
      if (trimmedRelationship !== null || relationship !== undefined) fields.relationship = trimmedRelationship;
      if (uploadedImageUrl) {
        if (existingMember.photo_url) deleteUploadedFile(existingMember.photo_url);
        fields.photoUrl = uploadedImageUrl;
      }
      updateFamilyMember(familyMemberId, fields);
    } else {
      familyMemberId = insertFamilyMember({
        patientId: patient.id,
        name: trimmedName,
        relationship: trimmedRelationship,
        photoUrl: uploadedImageUrl,
      });
    }
  }

  // For non-"photo" memories (place/voice/song) there's no family member to
  // own the image, so it belongs directly to the memory itself.
  const memoryImageUrl = type === 'photo' ? null : uploadedImageUrl;

  const memoryId = insertMemory({
    patientId: patient.id,
    familyMemberId,
    type,
    title: trimmedTitle,
    description: trimmedDescription,
    imageUrl: memoryImageUrl,
  });

  res.status(201).json({ memory: getMemoryById(memoryId) });
});

router.patch('/memories/:id', requireAuth, requireRole('caregiver'), handleUpload, (req, res) => {
  const patient = getPatientUser();
  if (!patient) {
    return res.status(404).json({ error: 'No patient is set up on this system yet.' });
  }

  const memoryId = Number(req.params.id);
  const existing = getMemoryOwnedByPatient(memoryId, patient.id);
  if (!existing) {
    return res.status(404).json({ error: 'Memory not found.' });
  }

  const { patientId, type, name, relationship, title, description } = req.body || {};

  // Patient association is never client-controlled — silently ignore any
  // attempt to send one rather than let it influence anything below.
  void patientId;

  let effectiveType = existing.type;
  if (type !== undefined) {
    if (typeof type !== 'string' || !MEMORY_TYPES.includes(type)) {
      return res.status(400).json({ error: `type must be one of: ${MEMORY_TYPES.join(', ')}` });
    }
    effectiveType = type;
  }

  const memoryUpdates = {};

  if (title !== undefined) {
    const trimmedTitle = typeof title === 'string' ? title.trim() : '';
    if (!trimmedTitle) return res.status(400).json({ error: 'title cannot be empty.' });
    if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      return res.status(400).json({ error: `title must be ${MAX_TITLE_LENGTH} characters or fewer.` });
    }
    memoryUpdates.title = trimmedTitle;
  }

  if (description !== undefined) {
    const trimmedDescription = trimmedOrNull(description, MAX_DESCRIPTION_LENGTH);
    if (trimmedDescription === undefined) return res.status(400).json({ error: 'description must be text.' });
    memoryUpdates.description = trimmedDescription;
  }

  if (type !== undefined) memoryUpdates.type = effectiveType;

  const imageInstruction = readImageInstruction(req);
  const oldFamilyPhotoUrl = existing.familyMemberPhotoUrl;
  const oldMemoryImageUrl = existing.imageUrl;

  if (effectiveType === 'photo') {
    let familyMemberId = existing.familyMemberId;
    const trimmedName = typeof name === 'string' ? name.trim() : undefined;

    if (!familyMemberId) {
      // Switching a non-photo memory into a photo memory, or a photo memory
      // that was somehow never linked — a name is required to create one.
      if (!trimmedName) {
        if (imageInstruction.action === 'set') deleteUploadedFile(imageInstruction.url);
        return res.status(400).json({ error: "A family member's name is required for a photo memory." });
      }
      const existingMember = getFamilyMemberByName(patient.id, trimmedName);
      familyMemberId = existingMember
        ? existingMember.id
        : insertFamilyMember({ patientId: patient.id, name: trimmedName, relationship: trimmedOrNull(relationship, MAX_RELATIONSHIP_LENGTH) || null });
      memoryUpdates.familyMemberId = familyMemberId;
    }

    const familyFields = {};
    if (trimmedName) {
      if (trimmedName.length > MAX_NAME_LENGTH) {
        return res.status(400).json({ error: `name must be ${MAX_NAME_LENGTH} characters or fewer.` });
      }
      familyFields.name = trimmedName;
    }
    if (relationship !== undefined) familyFields.relationship = trimmedOrNull(relationship, MAX_RELATIONSHIP_LENGTH);
    if (imageInstruction.action === 'set') {
      familyFields.photoUrl = imageInstruction.url;
      if (oldFamilyPhotoUrl) deleteUploadedFile(oldFamilyPhotoUrl);
    } else if (imageInstruction.action === 'clear') {
      familyFields.photoUrl = null;
      if (oldFamilyPhotoUrl) deleteUploadedFile(oldFamilyPhotoUrl);
    }
    if (Object.keys(familyFields).length > 0) updateFamilyMember(familyMemberId, familyFields);
  } else {
    // Non-photo memory: any image belongs to the memory row itself.
    if (imageInstruction.action === 'set') {
      memoryUpdates.imageUrl = imageInstruction.url;
      if (oldMemoryImageUrl) deleteUploadedFile(oldMemoryImageUrl);
    } else if (imageInstruction.action === 'clear') {
      memoryUpdates.imageUrl = null;
      if (oldMemoryImageUrl) deleteUploadedFile(oldMemoryImageUrl);
    }
  }

  if (Object.keys(memoryUpdates).length > 0) updateMemory(memoryId, memoryUpdates);

  res.json({ memory: getMemoryById(memoryId) });
});

module.exports = router;
