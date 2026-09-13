const crypto = require('node:crypto');
const path = require('node:path');
const fs = require('node:fs');
const multer = require('multer');

// Local, on-disk storage for memory/family-member photos and voice-memory
// audio — no cloud storage, no base64-in-SQLite, per the current project
// scope. Files live under backend/uploads/memories and are served
// statically by server.js at /uploads/memories/<filename>; only that
// relative path is ever stored in the database (memories.image_url /
// memories.audio_url / family_members.photo_url).
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads', 'memories');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB — plenty for a photo, small enough for an MVP's local disk
const MAX_AUDIO_BYTES = 15 * 1024 * 1024; // ~ a few minutes of spoken audio at a modest bitrate

// Mapping is deliberately whitelist-only per field: the accepted extension
// is chosen by the server from the detected MIME type, never taken from
// the caregiver's original filename, so a file can't be renamed to fake a
// different type and no path-traversal-bearing filename ever reaches disk.
const IMAGE_MIME_TO_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

// Covers what browsers' MediaRecorder actually produces (audio/webm in
// Chrome/Firefox/Edge, audio/mp4 in Safari) plus a few common file formats
// for the "upload an existing recording" path.
const AUDIO_MIME_TO_EXT = {
  'audio/webm': '.webm',
  'audio/ogg': '.ogg',
  'audio/mpeg': '.mp3',
  'audio/mp3': '.mp3',
  'audio/mp4': '.m4a',
  'audio/x-m4a': '.m4a',
  'audio/aac': '.aac',
  'audio/wav': '.wav',
  'audio/wave': '.wav',
  'audio/x-wav': '.wav',
};

function extForFile(file) {
  if (file.fieldname === 'image') return IMAGE_MIME_TO_EXT[file.mimetype];
  if (file.fieldname === 'audio') return AUDIO_MIME_TO_EXT[file.mimetype];
  return undefined;
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = extForFile(file);
    // fileFilter below rejects anything not in the whitelist before this
    // ever runs, but fall back defensively rather than trust file.mimetype
    // blindly if that ever changes.
    const safeExt = ext || (file.fieldname === 'audio' ? '.webm' : '.jpg');
    cb(null, `${crypto.randomUUID()}${safeExt}`);
  },
});

function fileFilter(_req, file, cb) {
  if (file.fieldname === 'image') {
    if (!IMAGE_MIME_TO_EXT[file.mimetype]) return cb(new Error('UNSUPPORTED_IMAGE_TYPE'));
    return cb(null, true);
  }
  if (file.fieldname === 'audio') {
    if (!AUDIO_MIME_TO_EXT[file.mimetype]) return cb(new Error('UNSUPPORTED_AUDIO_TYPE'));
    return cb(null, true);
  }
  cb(new Error('UNSUPPORTED_FIELD'));
}

// A single multer instance handling both possible file fields ('image' and
// 'audio') on any given request — a request only ever sends the field(s)
// relevant to its memory type. There's no per-field size limit in multer,
// so this caps at the larger of the two allowances; routes that accept an
// image also re-check its size against MAX_IMAGE_BYTES themselves.
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_AUDIO_BYTES, files: 2 },
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'audio', maxCount: 1 },
]);

// The public URL path a stored file is reachable at — this is the exact
// string persisted in the DB and returned to the frontend.
function publicUrlFor(filename) {
  return `/uploads/memories/${filename}`;
}

// Deletes a previously-uploaded file given the public URL path stored in
// the DB. Only ever deletes files inside UPLOAD_DIR — resolves the path
// and verifies it's still within that directory before unlinking, so a
// malformed/crafted stored value can never delete an arbitrary file.
function deleteUploadedFile(publicUrl) {
  if (!publicUrl || !publicUrl.startsWith('/uploads/memories/')) return;
  const filename = path.basename(publicUrl);
  const fullPath = path.join(UPLOAD_DIR, filename);
  if (!fullPath.startsWith(UPLOAD_DIR)) return; // defense in depth against path traversal
  fs.unlink(fullPath, () => {}); // best-effort; a missing file is not an error here
}

module.exports = {
  upload,
  publicUrlFor,
  deleteUploadedFile,
  UPLOAD_DIR,
  MAX_IMAGE_BYTES,
  MAX_AUDIO_BYTES,
};
