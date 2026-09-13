const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { upload, publicUrlFor, deleteUploadedFile, MAX_IMAGE_BYTES } = require('../middleware/upload');
const {
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
} = require('../models/memories');
const {
  getRoutinesWithCompletionForPatient,
  getRoutineOwnedByPatient,
  getRoutineWithCompletionOwnedByPatient,
  insertRoutine,
  updateRoutine,
  deleteRoutine,
  markRoutineComplete,
  unmarkRoutineComplete,
} = require('../models/routines');
const {
  getActivitySettingsForPatient,
  isValidActivityType,
  setActivityEnabled,
  getActivityCompletionCountForPatient,
} = require('../models/activities');

const router = express.Router();

const MEMORY_TYPES = ['photo', 'voice', 'place', 'song'];
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_NAME_LENGTH = 200;
const MAX_RELATIONSHIP_LENGTH = 100;
const MAX_ROUTINE_DETAIL_LENGTH = 500;
const ROUTINE_TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/; // 24-hour 'HH:MM', matches <input type="time">
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/; // 'YYYY-MM-DD', always the CALLER's local calendar day — see models/routines.js

// Reads (dashboard, listing) fall back to the server's own UTC date if the
// caller omits `date` entirely — a soft convenience for direct API use.
// The frontend always passes the viewer's actual local date explicitly
// (see frontend/src/utils/formatDate.js's getLocalDateString), which is
// what actually matters: a fallback here only ever affects a caller that
// isn't sending it at all.
function resolveDateOrToday(raw) {
  if (typeof raw === 'string' && DATE_PATTERN.test(raw)) return raw;
  return new Date().toISOString().slice(0, 10);
}

function trimmedOrNull(value, maxLength) {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') return undefined; // signals "invalid type" to the caller
  return value.trim().slice(0, maxLength) || null;
}

// A single image/audio field arrives as either a real uploaded file
// (multipart, via multer's req.files.<field>) or, for image, as a "remove
// it" instruction (a plain `removeImage` flag on the body) or as "leave it
// alone" (neither present). This never trusts a client-supplied file
// *URL* — the only way an image_url/audio_url/photo_url value reaches the
// database is by the server generating it from an actual uploaded file.
function readImageInstruction(req) {
  const file = req.files?.image?.[0];
  if (file) return { action: 'set', url: publicUrlFor(file.filename) };
  const removeImage = req.body?.removeImage;
  if (removeImage === true || removeImage === 'true') return { action: 'clear' };
  return { action: 'none' };
}

// Audio has no "remove it, keep the memory" instruction — a voice memory's
// audio *is* the memory's content, so the only meaningful states are "here
// is a (new) recording" or "leave whatever's already there alone".
function readAudioInstruction(req) {
  const file = req.files?.audio?.[0];
  if (file) return { action: 'set', url: publicUrlFor(file.filename) };
  return { action: 'none' };
}

// multer's per-request file-size limit is shared across the 'image' and
// 'audio' fields (set to the larger, audio allowance — see upload.js), so
// an oversized image slips past that check; this re-validates it and
// cleans up the file if it's too big.
function rejectOversizedImage(req) {
  const file = req.files?.image?.[0];
  if (file && file.size > MAX_IMAGE_BYTES) {
    deleteUploadedFile(publicUrlFor(file.filename));
    return true;
  }
  return false;
}

function cleanupInstructions(...instructions) {
  for (const instruction of instructions) {
    if (instruction?.action === 'set') deleteUploadedFile(instruction.url);
  }
}

// Parses a `familyMemberId` field off a request body. Returns:
//   - `null` if nothing was sent (no id — caller should fall back to
//     "create a new person", "keep the current link", or "no person",
//     depending on route/type)
//   - a positive integer if a plausible id was sent
//   - `undefined` if something was sent but it isn't a valid id (caller
//     should reject the request rather than silently ignore it)
function parseFamilyMemberId(rawValue) {
  if (rawValue === undefined || rawValue === null || rawValue === '') return null;
  const id = Number(rawValue);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

// Applies an image instruction to an existing family member's photo,
// deleting whatever file it's replacing. Never used for a family member
// created earlier in the same request — its photo was already set at
// INSERT time, so re-applying here would delete the file it just linked.
function applyFamilyMemberPhoto(familyMemberId, currentPhotoUrl, imageInstruction) {
  if (imageInstruction.action === 'set') {
    if (currentPhotoUrl) deleteUploadedFile(currentPhotoUrl);
    updateFamilyMember(familyMemberId, { photoUrl: imageInstruction.url });
  } else if (imageInstruction.action === 'clear') {
    if (currentPhotoUrl) deleteUploadedFile(currentPhotoUrl);
    updateFamilyMember(familyMemberId, { photoUrl: null });
  }
}

// Seeded/mock payload for everything the dashboard shows EXCEPT memories,
// family members, and the daily routine, which come from the real
// `memories`/`family_members`/`routines` tables (see db.js and the routes
// below). The rest is still static — see implementation.md Phase 2
// (C-T1–C-T4) for what would back these for real.
function getAitonDashboard(memories, familyMembers, routines, routineProgress, activities, activitiesCompletedToday) {
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
        value: `${routineProgress.completed} / ${routineProgress.total}`,
        valueSuffix: 'Completed',
        detail:
          routineProgress.total === 0
            ? 'No routine items yet'
            : routineProgress.completed === routineProgress.total
              ? 'All done for today'
              : `${routineProgress.total - routineProgress.completed} item${routineProgress.total - routineProgress.completed === 1 ? '' : 's'} remaining`,
        note: "Today's Progress",
        warning: routineProgress.total > 0 && routineProgress.completed < routineProgress.total,
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
    familyMembers,
    routines,
    routineProgress,
    activities,
    activitiesCompletedToday,
    deviceLedger: '#ML-SHL-74A',
  };
}

router.get('/dashboard', requireAuth, requireRole('caregiver'), (req, res) => {
  const patient = getPatientUser();
  const date = resolveDateOrToday(req.query.date);
  const memories = patient ? getMemoriesForPatient(patient.id) : [];
  const familyMembers = patient ? getFamilyMembersForPatient(patient.id) : [];
  const routines = patient ? getRoutinesWithCompletionForPatient(patient.id, date) : [];
  const activities = patient ? getActivitySettingsForPatient(patient.id) : [];
  const activitiesCompletedToday = patient ? getActivityCompletionCountForPatient(patient.id, date) : 0;
  const routineProgress = {
    completed: routines.filter((r) => r.completed).length,
    total: routines.length,
  };
  res.json(getAitonDashboard(memories, familyMembers, routines, routineProgress, activities, activitiesCompletedToday));
});

router.get('/memories', requireAuth, requireRole('caregiver'), (_req, res) => {
  const patient = getPatientUser();
  if (!patient) {
    return res.status(404).json({ error: 'No patient is set up on this system yet.' });
  }
  res.json({ memories: getMemoriesForPatient(patient.id) });
});

router.get('/family-members', requireAuth, requireRole('caregiver'), (_req, res) => {
  const patient = getPatientUser();
  if (!patient) {
    return res.status(404).json({ error: 'No patient is set up on this system yet.' });
  }
  res.json({ familyMembers: getFamilyMembersForPatient(patient.id) });
});

router.get('/routines', requireAuth, requireRole('caregiver'), (req, res) => {
  const patient = getPatientUser();
  if (!patient) {
    return res.status(404).json({ error: 'No patient is set up on this system yet.' });
  }
  const date = resolveDateOrToday(req.query.date);
  res.json({ routines: getRoutinesWithCompletionForPatient(patient.id, date) });
});

// Wraps multer so its errors (file too large, unsupported type, etc.)
// become the same JSON error shape as the rest of the API instead of an
// HTML crash page.
function handleUpload(req, res, next) {
  upload(req, res, (err) => {
    if (!err) return next();
    if (err.message === 'UNSUPPORTED_IMAGE_TYPE') {
      return res.status(400).json({ error: 'Image must be a JPEG, PNG, or WebP file.' });
    }
    if (err.message === 'UNSUPPORTED_AUDIO_TYPE') {
      return res.status(400).json({ error: 'Audio must be a WebM, OGG, MP3, M4A, AAC, or WAV file.' });
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'That file is too large.' });
    }
    return res.status(400).json({ error: 'Could not process the uploaded file.' });
  });
}

// Resolves who a memory is "about" for a type that allows an OPTIONAL
// family-member link (currently 'voice' only — 'photo' has its own
// dedicated, mandatory-link flow below because it also owns that person's
// photo). Exactly one of these is ever true for a given request:
//   - a brand-new person is named (`name` present + non-empty) — created,
//     ignoring any familyMemberId also present
//   - an existing person is referenced (`familyMemberId` a positive int)
//     — verified to belong to this patient
//   - the link is explicitly cleared (`familyMemberId` present as '' — a
//     PATCH-only case; POST simply omits the field for "no one")
//   - nothing about the link was touched at all (both fields absent)
// Returns `{ ok: true, familyMemberId, touched }` or `{ ok: false, respond }`
// where `respond` is a function that sends the appropriate error response.
function resolveOptionalFamilyMemberLink({ patient, rawFamilyMemberId, name, relationship }) {
  const trimmedName = typeof name === 'string' ? name.trim() : '';

  if (trimmedName) {
    if (trimmedName.length > MAX_NAME_LENGTH) {
      return { ok: false, respond: (res) => res.status(400).json({ error: `name must be ${MAX_NAME_LENGTH} characters or fewer.` }) };
    }
    const familyMemberId = insertFamilyMember({
      patientId: patient.id,
      name: trimmedName,
      relationship: trimmedOrNull(relationship, MAX_RELATIONSHIP_LENGTH),
      photoUrl: null,
    });
    return { ok: true, familyMemberId, touched: true };
  }

  if (rawFamilyMemberId === undefined) {
    return { ok: true, familyMemberId: undefined, touched: false };
  }

  if (rawFamilyMemberId === '') {
    return { ok: true, familyMemberId: null, touched: true };
  }

  const parsed = parseFamilyMemberId(rawFamilyMemberId);
  if (!parsed) {
    return { ok: false, respond: (res) => res.status(400).json({ error: 'familyMemberId must be a valid id.' }) };
  }
  const existingMember = getFamilyMemberOwnedByPatient(parsed, patient.id);
  if (!existingMember) {
    return { ok: false, respond: (res) => res.status(404).json({ error: 'That family member could not be found.' }) };
  }
  return { ok: true, familyMemberId: existingMember.id, touched: true };
}

router.post('/memories', requireAuth, requireRole('caregiver'), handleUpload, (req, res) => {
  const patient = getPatientUser();
  if (!patient) {
    return res.status(404).json({ error: 'No patient is set up on this system yet.' });
  }

  const { patientId, type, familyMemberId: rawFamilyMemberId, name, relationship, title, description } = req.body || {};

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

  if (rejectOversizedImage(req)) {
    cleanupInstructions(readAudioInstruction(req));
    return res.status(400).json({ error: 'Image must be 5MB or smaller.' });
  }

  const imageInstruction = readImageInstruction(req);
  const audioInstruction = readAudioInstruction(req);
  const uploadedImageUrl = imageInstruction.action === 'set' ? imageInstruction.url : null;
  const uploadedAudioUrl = audioInstruction.action === 'set' ? audioInstruction.url : null;

  let familyMemberId = null;

  if (type === 'photo') {
    // Non-photo uploads have no business on a photo memory — clean up
    // defensively rather than silently store an unreferenced file.
    if (uploadedAudioUrl) deleteUploadedFile(uploadedAudioUrl);

    // Who this photo memory is about is always resolved by a stable id,
    // never by matching what the caregiver typed against existing names —
    // that's what used to let two different requests for "Rina" and
    // "rina " silently create two different people, or a typo silently
    // attach to the wrong existing one.
    const parsedFamilyMemberId = parseFamilyMemberId(rawFamilyMemberId);
    if (parsedFamilyMemberId === undefined) {
      if (uploadedImageUrl) deleteUploadedFile(uploadedImageUrl);
      return res.status(400).json({ error: 'familyMemberId must be a valid id.' });
    }

    if (parsedFamilyMemberId) {
      const existingMember = getFamilyMemberOwnedByPatient(parsedFamilyMemberId, patient.id);
      if (!existingMember) {
        if (uploadedImageUrl) deleteUploadedFile(uploadedImageUrl);
        return res.status(404).json({ error: 'That family member could not be found.' });
      }
      familyMemberId = existingMember.id;
      if (uploadedImageUrl) applyFamilyMemberPhoto(familyMemberId, existingMember.photoUrl, imageInstruction);
    } else {
      const trimmedName = typeof name === 'string' ? name.trim() : '';
      if (!trimmedName) {
        if (uploadedImageUrl) deleteUploadedFile(uploadedImageUrl);
        return res.status(400).json({ error: "A family member's name is required for a photo memory." });
      }
      if (trimmedName.length > MAX_NAME_LENGTH) {
        if (uploadedImageUrl) deleteUploadedFile(uploadedImageUrl);
        return res.status(400).json({ error: `name must be ${MAX_NAME_LENGTH} characters or fewer.` });
      }
      const trimmedRelationship = trimmedOrNull(relationship, MAX_RELATIONSHIP_LENGTH);
      familyMemberId = insertFamilyMember({
        patientId: patient.id,
        name: trimmedName,
        relationship: trimmedRelationship,
        photoUrl: uploadedImageUrl,
      });
    }
  } else if (type === 'voice') {
    if (!uploadedAudioUrl) {
      if (uploadedImageUrl) deleteUploadedFile(uploadedImageUrl);
      return res.status(400).json({ error: 'An audio recording is required for a voice memory.' });
    }

    const link = resolveOptionalFamilyMemberLink({ patient, rawFamilyMemberId, name, relationship });
    if (!link.ok) {
      cleanupInstructions(imageInstruction, audioInstruction);
      return link.respond(res);
    }
    familyMemberId = link.familyMemberId ?? null;
  } else {
    // place/song — no family member, and no audio field belongs here.
    if (uploadedAudioUrl) deleteUploadedFile(uploadedAudioUrl);
  }

  // For "photo" memories the image belongs to the family member, not the
  // memory row itself. For "voice" memories the audio is the memory's
  // content; an image, if provided, is just an optional accompanying photo.
  const memoryImageUrl = type === 'photo' ? null : uploadedImageUrl;
  const memoryAudioUrl = type === 'voice' ? uploadedAudioUrl : null;

  const memoryId = insertMemory({
    patientId: patient.id,
    familyMemberId,
    type,
    title: trimmedTitle,
    description: trimmedDescription,
    imageUrl: memoryImageUrl,
    audioUrl: memoryAudioUrl,
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

  const { patientId, type, familyMemberId: rawFamilyMemberId, name, relationship, title, description } = req.body || {};

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

  if (rejectOversizedImage(req)) {
    cleanupInstructions(readAudioInstruction(req));
    return res.status(400).json({ error: 'Image must be 5MB or smaller.' });
  }

  const imageInstruction = readImageInstruction(req);
  const audioInstruction = readAudioInstruction(req);
  const oldMemoryImageUrl = existing.imageUrl;
  const oldMemoryAudioUrl = existing.audioUrl;

  if (effectiveType === 'photo') {
    const parsedFamilyMemberId = parseFamilyMemberId(rawFamilyMemberId);
    if (parsedFamilyMemberId === undefined) {
      cleanupInstructions(imageInstruction, audioInstruction);
      return res.status(400).json({ error: 'familyMemberId must be a valid id.' });
    }

    let familyMemberId;

    if (parsedFamilyMemberId) {
      // Explicit relink to a specific existing person (or the same one,
      // re-sent) — validated by id and ownership, never by name.
      const familyMemberRow = getFamilyMemberOwnedByPatient(parsedFamilyMemberId, patient.id);
      if (!familyMemberRow) {
        cleanupInstructions(imageInstruction, audioInstruction);
        return res.status(404).json({ error: 'That family member could not be found.' });
      }
      familyMemberId = familyMemberRow.id;
      applyFamilyMemberPhoto(familyMemberId, familyMemberRow.photoUrl, imageInstruction);
    } else if (existing.familyMemberId) {
      // Nothing sent — keep the memory's current link, but still allow
      // replacing/clearing that person's photo through this form.
      familyMemberId = existing.familyMemberId;
      const familyMemberRow = getFamilyMemberById(familyMemberId);
      applyFamilyMemberPhoto(familyMemberId, familyMemberRow?.photoUrl, imageInstruction);
    } else {
      // No link exists yet (e.g. switching a non-photo memory into a photo
      // memory) — a name is required to create a brand-new person. Validated
      // BEFORE insertFamilyMember runs, so a rejected request never leaves
      // an orphaned family_members row behind.
      const trimmedName = typeof name === 'string' ? name.trim() : '';
      if (!trimmedName) {
        cleanupInstructions(imageInstruction, audioInstruction);
        return res.status(400).json({ error: "A family member's name is required for a photo memory." });
      }
      if (trimmedName.length > MAX_NAME_LENGTH) {
        cleanupInstructions(imageInstruction, audioInstruction);
        return res.status(400).json({ error: `name must be ${MAX_NAME_LENGTH} characters or fewer.` });
      }
      familyMemberId = insertFamilyMember({
        patientId: patient.id,
        name: trimmedName,
        relationship: trimmedOrNull(relationship, MAX_RELATIONSHIP_LENGTH),
        photoUrl: imageInstruction.action === 'set' ? imageInstruction.url : null,
      });
    }

    memoryUpdates.familyMemberId = familyMemberId;

    // A photo memory never keeps its own image/audio columns — the image
    // lives on the family member instead (handled above), and audio never
    // applies to this type.
    if (oldMemoryImageUrl) {
      deleteUploadedFile(oldMemoryImageUrl);
      memoryUpdates.imageUrl = null;
    }
    if (oldMemoryAudioUrl) {
      deleteUploadedFile(oldMemoryAudioUrl);
      memoryUpdates.audioUrl = null;
    }
    if (audioInstruction.action === 'set') deleteUploadedFile(audioInstruction.url); // shouldn't be sent, defensive
  } else if (effectiveType === 'voice') {
    const link = resolveOptionalFamilyMemberLink({ patient, rawFamilyMemberId, name, relationship });
    if (!link.ok) {
      cleanupInstructions(imageInstruction, audioInstruction);
      return link.respond(res);
    }
    if (link.touched) memoryUpdates.familyMemberId = link.familyMemberId;

    if (audioInstruction.action === 'set') {
      if (oldMemoryAudioUrl) deleteUploadedFile(oldMemoryAudioUrl);
      memoryUpdates.audioUrl = audioInstruction.url;
    } else if (!oldMemoryAudioUrl) {
      // Switching a memory into "voice" with no existing recording and
      // none provided in this request — a voice memory is its recording.
      cleanupInstructions(imageInstruction);
      return res.status(400).json({ error: 'An audio recording is required for a voice memory.' });
    }

    if (imageInstruction.action === 'set') {
      memoryUpdates.imageUrl = imageInstruction.url;
      if (oldMemoryImageUrl) deleteUploadedFile(oldMemoryImageUrl);
    } else if (imageInstruction.action === 'clear') {
      memoryUpdates.imageUrl = null;
      if (oldMemoryImageUrl) deleteUploadedFile(oldMemoryImageUrl);
    }
  } else {
    // place/song: no family member, no audio — any image belongs to the
    // memory row itself.
    if (existing.familyMemberId) memoryUpdates.familyMemberId = null;
    if (oldMemoryAudioUrl) {
      deleteUploadedFile(oldMemoryAudioUrl);
      memoryUpdates.audioUrl = null;
    }
    if (audioInstruction.action === 'set') deleteUploadedFile(audioInstruction.url); // shouldn't be sent, defensive

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

router.delete('/memories/:id', requireAuth, requireRole('caregiver'), (req, res) => {
  const patient = getPatientUser();
  if (!patient) {
    return res.status(404).json({ error: 'No patient is set up on this system yet.' });
  }

  const memoryId = Number(req.params.id);
  const existing = getMemoryOwnedByPatient(memoryId, patient.id);
  if (!existing) {
    return res.status(404).json({ error: 'Memory not found.' });
  }

  // The memory's own uploaded files (place/voice/song types only — a
  // photo memory's image lives on its family member, which this delete
  // never touches, since that person may still be linked from other
  // memories).
  if (existing.imageUrl) deleteUploadedFile(existing.imageUrl);
  if (existing.audioUrl) deleteUploadedFile(existing.audioUrl);
  deleteMemory(memoryId);

  res.json({ success: true, id: memoryId });
});

router.post('/family-members', requireAuth, requireRole('caregiver'), handleUpload, (req, res) => {
  const patient = getPatientUser();
  if (!patient) {
    return res.status(404).json({ error: 'No patient is set up on this system yet.' });
  }

  if (rejectOversizedImage(req)) {
    return res.status(400).json({ error: 'Image must be 5MB or smaller.' });
  }

  const { name, relationship } = req.body || {};
  const imageInstruction = readImageInstruction(req);
  const uploadedImageUrl = imageInstruction.action === 'set' ? imageInstruction.url : null;

  const trimmedName = typeof name === 'string' ? name.trim() : '';
  if (!trimmedName) {
    if (uploadedImageUrl) deleteUploadedFile(uploadedImageUrl);
    return res.status(400).json({ error: 'A name is required.' });
  }
  if (trimmedName.length > MAX_NAME_LENGTH) {
    if (uploadedImageUrl) deleteUploadedFile(uploadedImageUrl);
    return res.status(400).json({ error: `name must be ${MAX_NAME_LENGTH} characters or fewer.` });
  }

  const id = insertFamilyMember({
    patientId: patient.id,
    name: trimmedName,
    relationship: trimmedOrNull(relationship, MAX_RELATIONSHIP_LENGTH),
    photoUrl: uploadedImageUrl,
  });

  res.status(201).json({ familyMember: getFamilyMemberOwnedByPatient(id, patient.id) });
});

router.patch('/family-members/:id', requireAuth, requireRole('caregiver'), handleUpload, (req, res) => {
  const patient = getPatientUser();
  if (!patient) {
    return res.status(404).json({ error: 'No patient is set up on this system yet.' });
  }

  const familyMemberId = Number(req.params.id);
  const existing = getFamilyMemberOwnedByPatient(familyMemberId, patient.id);
  if (!existing) {
    return res.status(404).json({ error: 'Family member not found.' });
  }

  if (rejectOversizedImage(req)) {
    return res.status(400).json({ error: 'Image must be 5MB or smaller.' });
  }

  const { name, relationship } = req.body || {};
  const imageInstruction = readImageInstruction(req);
  const fields = {};

  if (name !== undefined) {
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    if (!trimmedName) {
      cleanupInstructions(imageInstruction);
      return res.status(400).json({ error: 'name cannot be empty.' });
    }
    if (trimmedName.length > MAX_NAME_LENGTH) {
      cleanupInstructions(imageInstruction);
      return res.status(400).json({ error: `name must be ${MAX_NAME_LENGTH} characters or fewer.` });
    }
    fields.name = trimmedName;
  }

  if (relationship !== undefined) {
    fields.relationship = trimmedOrNull(relationship, MAX_RELATIONSHIP_LENGTH);
  }

  if (imageInstruction.action === 'set') {
    if (existing.photoUrl) deleteUploadedFile(existing.photoUrl);
    fields.photoUrl = imageInstruction.url;
  } else if (imageInstruction.action === 'clear') {
    if (existing.photoUrl) deleteUploadedFile(existing.photoUrl);
    fields.photoUrl = null;
  }

  if (Object.keys(fields).length > 0) updateFamilyMember(familyMemberId, fields);

  res.json({ familyMember: getFamilyMemberOwnedByPatient(familyMemberId, patient.id) });
});

router.delete('/family-members/:id', requireAuth, requireRole('caregiver'), (req, res) => {
  const patient = getPatientUser();
  if (!patient) {
    return res.status(404).json({ error: 'No patient is set up on this system yet.' });
  }

  const familyMemberId = Number(req.params.id);
  const existing = getFamilyMemberOwnedByPatient(familyMemberId, patient.id);
  if (!existing) {
    return res.status(404).json({ error: 'Family member not found.' });
  }

  // Detach (never cascade-delete) any memory still pointing at this person
  // — their photo and description stay put, they just stop being "about"
  // anyone once the person themselves is removed from the patient's people.
  nullifyFamilyMemberOnMemories(familyMemberId);
  if (existing.photoUrl) deleteUploadedFile(existing.photoUrl);
  deleteFamilyMember(familyMemberId);

  res.json({ success: true, id: familyMemberId });
});

function validateRoutineTime(time) {
  return typeof time === 'string' && ROUTINE_TIME_PATTERN.test(time);
}

router.post('/routines', requireAuth, requireRole('caregiver'), (req, res) => {
  const patient = getPatientUser();
  if (!patient) {
    return res.status(404).json({ error: 'No patient is set up on this system yet.' });
  }

  const { time, title, detail } = req.body || {};

  if (!validateRoutineTime(time)) {
    return res.status(400).json({ error: 'time must be in 24-hour HH:MM format.' });
  }

  const trimmedTitle = typeof title === 'string' ? title.trim() : '';
  if (!trimmedTitle) {
    return res.status(400).json({ error: 'title is required.' });
  }
  if (trimmedTitle.length > MAX_TITLE_LENGTH) {
    return res.status(400).json({ error: `title must be ${MAX_TITLE_LENGTH} characters or fewer.` });
  }

  const trimmedDetail = trimmedOrNull(detail, MAX_ROUTINE_DETAIL_LENGTH);
  if (trimmedDetail === undefined) {
    return res.status(400).json({ error: 'detail must be text.' });
  }

  const id = insertRoutine({ patientId: patient.id, time, title: trimmedTitle, detail: trimmedDetail });
  res.status(201).json({ routine: getRoutineOwnedByPatient(id, patient.id) });
});

router.patch('/routines/:id', requireAuth, requireRole('caregiver'), (req, res) => {
  const patient = getPatientUser();
  if (!patient) {
    return res.status(404).json({ error: 'No patient is set up on this system yet.' });
  }

  const routineId = Number(req.params.id);
  const existing = getRoutineOwnedByPatient(routineId, patient.id);
  if (!existing) {
    return res.status(404).json({ error: 'Routine item not found.' });
  }

  const { time, title, detail } = req.body || {};
  const fields = {};

  if (time !== undefined) {
    if (!validateRoutineTime(time)) {
      return res.status(400).json({ error: 'time must be in 24-hour HH:MM format.' });
    }
    fields.time = time;
  }

  if (title !== undefined) {
    const trimmedTitle = typeof title === 'string' ? title.trim() : '';
    if (!trimmedTitle) return res.status(400).json({ error: 'title cannot be empty.' });
    if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      return res.status(400).json({ error: `title must be ${MAX_TITLE_LENGTH} characters or fewer.` });
    }
    fields.title = trimmedTitle;
  }

  if (detail !== undefined) {
    const trimmedDetail = trimmedOrNull(detail, MAX_ROUTINE_DETAIL_LENGTH);
    if (trimmedDetail === undefined) return res.status(400).json({ error: 'detail must be text.' });
    fields.detail = trimmedDetail;
  }

  if (Object.keys(fields).length > 0) updateRoutine(routineId, fields);

  res.json({ routine: getRoutineOwnedByPatient(routineId, patient.id) });
});

router.delete('/routines/:id', requireAuth, requireRole('caregiver'), (req, res) => {
  const patient = getPatientUser();
  if (!patient) {
    return res.status(404).json({ error: 'No patient is set up on this system yet.' });
  }

  const routineId = Number(req.params.id);
  const existing = getRoutineOwnedByPatient(routineId, patient.id);
  if (!existing) {
    return res.status(404).json({ error: 'Routine item not found.' });
  }

  deleteRoutine(routineId);
  res.json({ success: true, id: routineId });
});

// A caregiver's "verify"/"mark as done" action — writes to the exact same
// routine_completions row a patient marking it done from their own tablet
// would create (see routes/patient.js), so both sides always agree: there
// is no separate caregiver-only completion state to drift out of sync.
router.post('/routines/:id/complete', requireAuth, requireRole('caregiver'), (req, res) => {
  const patient = getPatientUser();
  if (!patient) {
    return res.status(404).json({ error: 'No patient is set up on this system yet.' });
  }

  const routineId = Number(req.params.id);
  const existing = getRoutineOwnedByPatient(routineId, patient.id);
  if (!existing) {
    return res.status(404).json({ error: 'Routine item not found.' });
  }

  const { date } = req.body || {};
  if (!DATE_PATTERN.test(date || '')) {
    return res.status(400).json({ error: 'date must be in YYYY-MM-DD format.' });
  }

  markRoutineComplete(routineId, patient.id, date);
  res.json({ routine: getRoutineWithCompletionOwnedByPatient(routineId, patient.id, date) });
});

// Lets a caregiver undo a mistaken verify/completion for a given day.
router.delete('/routines/:id/complete', requireAuth, requireRole('caregiver'), (req, res) => {
  const patient = getPatientUser();
  if (!patient) {
    return res.status(404).json({ error: 'No patient is set up on this system yet.' });
  }

  const routineId = Number(req.params.id);
  const existing = getRoutineOwnedByPatient(routineId, patient.id);
  if (!existing) {
    return res.status(404).json({ error: 'Routine item not found.' });
  }

  const date = resolveDateOrToday(req.query.date);
  unmarkRoutineComplete(routineId, date);
  res.json({ routine: getRoutineWithCompletionOwnedByPatient(routineId, patient.id, date) });
});

// The full common Activities/Games catalog with this patient's enabled
// flags — same list already embedded in /dashboard, exposed standalone
// too for a caregiver UI that only needs this piece.
router.get('/activities', requireAuth, requireRole('caregiver'), (_req, res) => {
  const patient = getPatientUser();
  if (!patient) {
    return res.status(404).json({ error: 'No patient is set up on this system yet.' });
  }
  res.json({ activities: getActivitySettingsForPatient(patient.id) });
});

// Turns one activity on/off for this patient. The activity *definitions*
// are fixed code (ACTIVITY_CATALOG), never caregiver-editable — only
// whether their patient sees a given one is.
router.patch('/activities/:type', requireAuth, requireRole('caregiver'), (req, res) => {
  const patient = getPatientUser();
  if (!patient) {
    return res.status(404).json({ error: 'No patient is set up on this system yet.' });
  }

  const { type } = req.params;
  if (!isValidActivityType(type)) {
    return res.status(404).json({ error: 'Unknown activity.' });
  }

  const { enabled } = req.body || {};
  if (typeof enabled !== 'boolean') {
    return res.status(400).json({ error: 'enabled must be true or false.' });
  }

  setActivityEnabled(patient.id, type, enabled);
  res.json({ activities: getActivitySettingsForPatient(patient.id) });
});

module.exports = router;
