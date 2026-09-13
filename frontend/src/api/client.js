const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = 'GET', body, token } = {}) {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      // Don't set Content-Type for FormData — the browser needs to add its
      // own multipart boundary, which it can only do if we leave this out.
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(data?.error || 'Request failed', res.status);
  }
  return data;
}

// Backend-served files (uploaded memory/family-member photos) are returned
// as relative paths like "/uploads/memories/<file>" — resolve them against
// the API origin, not the frontend's own origin, since they're served by
// the backend's Express static middleware.
function resolveAssetUrl(relativePath) {
  if (!relativePath) return null;
  return `${API_URL}${relativePath}`;
}

// Builds the multipart body shared by create/update — only appends fields
// that are actually provided, so callers can send partial updates.
// `familyMemberId` links a photo/voice memory to an existing person by
// their stable id (an empty string explicitly clears a voice memory's
// link); `name`/`relationship` are only used to create a brand-new person
// when no familyMemberId is given; `audio` is the recording/upload for a
// voice memory — see backend/routes/caregiver.js.
function buildMemoryFormData({
  type,
  familyMemberId,
  name,
  relationship,
  title,
  description,
  image,
  removeImage,
  audio,
}) {
  const form = new FormData();
  if (type !== undefined) form.append('type', type);
  if (familyMemberId !== undefined && familyMemberId !== null) form.append('familyMemberId', familyMemberId);
  if (name !== undefined) form.append('name', name);
  if (relationship !== undefined) form.append('relationship', relationship ?? '');
  if (title !== undefined) form.append('title', title);
  if (description !== undefined) form.append('description', description ?? '');
  if (image) form.append('image', image);
  if (removeImage) form.append('removeImage', 'true');
  if (audio) form.append('audio', audio);
  return form;
}

function buildFamilyMemberFormData({ name, relationship, image, removeImage }) {
  const form = new FormData();
  if (name !== undefined) form.append('name', name);
  if (relationship !== undefined) form.append('relationship', relationship ?? '');
  if (image) form.append('image', image);
  if (removeImage) form.append('removeImage', 'true');
  return form;
}

export const authApi = {
  login: (username, password) => request('/api/auth/login', { method: 'POST', body: { username, password } }),
};

export const patientApi = {
  getMemories: (token) => request('/api/patient/memories', { token }),
  // `date` is always the viewer's own local calendar day (see
  // utils/formatDate.js's getLocalDateString) — never computed by the
  // server, so completion never lands on the wrong day near midnight.
  getRoutines: (token, date) => request(`/api/patient/routines?date=${encodeURIComponent(date)}`, { token }),
  completeRoutine: (token, id, date) =>
    request(`/api/patient/routines/${id}/complete`, { method: 'POST', token, body: { date } }),
  getActivities: (token) => request('/api/patient/activities', { token }),
  completeActivity: (token, type, date) =>
    request(`/api/patient/activities/${type}/complete`, { method: 'POST', token, body: { date } }),
};

export const caregiverApi = {
  getDashboard: (token, date) =>
    request(`/api/caregiver/dashboard${date ? `?date=${encodeURIComponent(date)}` : ''}`, { token }),
  getMemories: (token) => request('/api/caregiver/memories', { token }),
  createMemory: (token, fields) =>
    request('/api/caregiver/memories', { method: 'POST', token, body: buildMemoryFormData(fields) }),
  updateMemory: (token, id, fields) =>
    request(`/api/caregiver/memories/${id}`, { method: 'PATCH', token, body: buildMemoryFormData(fields) }),
  deleteMemory: (token, id) => request(`/api/caregiver/memories/${id}`, { method: 'DELETE', token }),
  getFamilyMembers: (token) => request('/api/caregiver/family-members', { token }),
  createFamilyMember: (token, fields) =>
    request('/api/caregiver/family-members', { method: 'POST', token, body: buildFamilyMemberFormData(fields) }),
  updateFamilyMember: (token, id, fields) =>
    request(`/api/caregiver/family-members/${id}`, { method: 'PATCH', token, body: buildFamilyMemberFormData(fields) }),
  deleteFamilyMember: (token, id) => request(`/api/caregiver/family-members/${id}`, { method: 'DELETE', token }),
  getRoutines: (token, date) =>
    request(`/api/caregiver/routines${date ? `?date=${encodeURIComponent(date)}` : ''}`, { token }),
  createRoutine: (token, fields) => request('/api/caregiver/routines', { method: 'POST', token, body: fields }),
  updateRoutine: (token, id, fields) =>
    request(`/api/caregiver/routines/${id}`, { method: 'PATCH', token, body: fields }),
  deleteRoutine: (token, id) => request(`/api/caregiver/routines/${id}`, { method: 'DELETE', token }),
  completeRoutine: (token, id, date) =>
    request(`/api/caregiver/routines/${id}/complete`, { method: 'POST', token, body: { date } }),
  uncompleteRoutine: (token, id, date) =>
    request(`/api/caregiver/routines/${id}/complete?date=${encodeURIComponent(date)}`, { method: 'DELETE', token }),
  getActivities: (token) => request('/api/caregiver/activities', { token }),
  setActivityEnabled: (token, type, enabled) =>
    request(`/api/caregiver/activities/${type}`, { method: 'PATCH', token, body: { enabled } }),
};

export { ApiError, resolveAssetUrl };
