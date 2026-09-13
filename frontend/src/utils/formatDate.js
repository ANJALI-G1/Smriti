// SQLite's datetime('now') returns 'YYYY-MM-DD HH:MM:SS' (UTC, no 'T'/'Z') —
// normalize before parsing. Shared by every patient/caregiver component
// that displays a memory's createdAt/updatedAt.
export function formatSqliteDate(isoLikeString, options = { month: 'short', day: 'numeric' }) {
  if (!isoLikeString) return '';
  const date = new Date(`${isoLikeString.replace(' ', 'T')}Z`);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, options);
}

// Routine items are stored as 24-hour 'HH:MM' (what <input type="time">
// natively produces/accepts, and what sorts correctly as plain text) —
// this formats one for display, e.g. '08:00' -> '8:00 AM'.
export function formatTimeOfDay(time24) {
  if (typeof time24 !== 'string' || !/^\d{2}:\d{2}$/.test(time24)) return time24 || '';
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`;
}

// The viewer's own local calendar day as 'YYYY-MM-DD' — deliberately built
// from getFullYear/getMonth/getDate (local time) rather than
// toISOString() (which is UTC), and always computed client-side rather
// than trusted from the server. Routine completion is recorded against
// whatever day this returns, so a patient/caregiver near midnight always
// gets attributed to the day their own device's clock says it is, not
// wherever the backend happens to be hosted.
export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Derives a routine item's status for "today" purely from data the API
// already returns (`completed`) plus the item's own scheduled `time` —
// there is no stored "missed" status anywhere, so this can never disagree
// with reality the way a periodically-recomputed server-side flag could.
// A routine is only ever "missed" once its scheduled time has actually
// passed and it's still not done — never just because the page happened
// to load before that time.
export function deriveRoutineStatus(item, now = new Date()) {
  if (item.completed) return 'completed';
  if (typeof item.time !== 'string' || !/^\d{2}:\d{2}$/.test(item.time)) return 'pending';
  const [hours, minutes] = item.time.split(':').map(Number);
  const scheduled = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);
  return now.getTime() > scheduled.getTime() ? 'missed' : 'pending';
}
