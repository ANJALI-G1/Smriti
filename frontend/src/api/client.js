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
function buildMemoryFormData({ type, name, relationship, title, description, image, removeImage }) {
  const form = new FormData();
  if (type !== undefined) form.append('type', type);
  if (name !== undefined) form.append('name', name);
  if (relationship !== undefined) form.append('relationship', relationship ?? '');
  if (title !== undefined) form.append('title', title);
  if (description !== undefined) form.append('description', description ?? '');
  if (image) form.append('image', image);
  if (removeImage) form.append('removeImage', 'true');
  return form;
}

export const authApi = {
  login: (username, password) => request('/api/auth/login', { method: 'POST', body: { username, password } }),
};

export const patientApi = {
  getMemories: (token) => request('/api/patient/memories', { token }),
};

export const caregiverApi = {
  getDashboard: (token) => request('/api/caregiver/dashboard', { token }),
  getMemories: (token) => request('/api/caregiver/memories', { token }),
  createMemory: (token, fields) =>
    request('/api/caregiver/memories', { method: 'POST', token, body: buildMemoryFormData(fields) }),
  updateMemory: (token, id, fields) =>
    request(`/api/caregiver/memories/${id}`, { method: 'PATCH', token, body: buildMemoryFormData(fields) }),
};

export { ApiError, resolveAssetUrl };
