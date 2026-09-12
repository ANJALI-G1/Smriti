const crypto = require('node:crypto');
const path = require('node:path');
const fs = require('node:fs');
const multer = require('multer');

// Local, on-disk storage for memory/family-member photos — no cloud
// storage, no base64-in-SQLite, per the current project scope. Files live
// under backend/uploads/memories and are served statically by server.js
// at /uploads/memories/<filename>; only that relative path is ever stored
// in the database (memories.image_url / family_members.photo_url).
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads', 'memories');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB — plenty for a photo, small enough for an MVP's local disk

// Mapping is deliberately whitelist-only: the accepted extension is chosen
// by the server from the detected MIME type, never taken from the
// caregiver's original filename, so a file can't be renamed to fake a
// different type and no path-traversal-bearing filename ever reaches disk.
const ALLOWED_MIME_TO_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = ALLOWED_MIME_TO_EXT[file.mimetype];
    // fileFilter below rejects anything not in the whitelist before this
    // ever runs, but fall back defensively rather than trust file.mimetype
    // blindly if that ever changes.
    const safeExt = ext || '.jpg';
    cb(null, `${crypto.randomUUID()}${safeExt}`);
  },
});

function fileFilter(_req, file, cb) {
  if (!ALLOWED_MIME_TO_EXT[file.mimetype]) {
    cb(new Error('UNSUPPORTED_IMAGE_TYPE'));
    return;
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 1 },
});

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

module.exports = { upload, publicUrlFor, deleteUploadedFile, UPLOAD_DIR, MAX_FILE_SIZE_BYTES };
