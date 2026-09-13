import { useState } from 'react';
import { ApiError } from '../../api/client.js';

const FRIENDLY_ERROR = "That routine item couldn't be saved. Please check the details and try again.";

// onSubmit: async ({ time, title, detail }) => Promise<routine>
// `time` is always 24-hour 'HH:MM' — <input type="time"> natively
// produces/accepts that format, which is also what the backend validates
// and what sorts correctly as plain text (see backend/models/routines.js).
// Pass `editingItem` to open in edit mode; the parent should remount this
// component (e.g. via a `key` prop) when switching which item is being
// edited/created, so this internal state resets.
export default function RoutineItemModal({ isOpen, onClose, onSubmit, editingItem }) {
  const isEditing = Boolean(editingItem);

  const [time, setTime] = useState(editingItem?.time || '');
  const [title, setTitle] = useState(editingItem?.title || '');
  const [detail, setDetail] = useState(editingItem?.detail || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError('');

    if (!time) {
      setError('Please choose a time.');
      return;
    }
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Please enter a title for this routine item.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ time, title: trimmedTitle, detail: detail.trim() || undefined });
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : FRIENDLY_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full sm:max-w-md rounded-3xl bg-white p-6 sm:p-8 text-left shadow-elevated border border-brand-border">
          <div className="flex items-center justify-between pb-3 border-b border-brand-border">
            <h4 className="font-editorial text-xl font-medium text-brand-charcoal">
              {isEditing ? 'Edit Routine Item' : 'Add Routine Item'}
            </h4>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-brand-slate hover:text-brand-charcoal disabled:opacity-40"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-brand-slate mt-2">
            {isEditing
              ? 'Changes are saved to the daily routine right away.'
              : "New items appear in Aiton's schedule in time order automatically."}
          </p>

          <form onSubmit={handleSubmit}>
            <fieldset disabled={isSubmitting} className="contents">
              <div className="space-y-3 text-xs mt-4">
                <div>
                  <label htmlFor="routine-time" className="block font-medium text-brand-charcoal mb-1">
                    Time
                  </label>
                  <input
                    id="routine-time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-brand-border focus:outline-none focus:border-brand-teal disabled:bg-brand-ivory"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="routine-title" className="block font-medium text-brand-charcoal mb-1">
                    Title
                  </label>
                  <input
                    id="routine-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Morning Tea & Breakfast"
                    className="w-full px-3 py-2 rounded-xl border border-brand-border focus:outline-none focus:border-brand-teal disabled:bg-brand-ivory"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="routine-detail" className="block font-medium text-brand-charcoal mb-1">
                    Details (optional)
                  </label>
                  <textarea
                    id="routine-detail"
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    placeholder="e.g., Ginger tea with roasted rice cake"
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl border border-brand-border focus:outline-none focus:border-brand-teal disabled:bg-brand-ivory"
                  />
                </div>
              </div>

              {error && (
                <p role="alert" className="mt-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  {error}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl border border-brand-border text-brand-slate disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-teal text-white font-semibold hover:bg-brand-tealDark disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting && (
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  )}
                  {isSubmitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}
