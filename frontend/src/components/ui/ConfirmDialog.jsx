// Small reusable confirmation modal for destructive actions (deleting a
// memory or a family member) — shares the same rounded-card modal look as
// AddMemoryModal/PatientLoginModal rather than a native window.confirm(),
// so it stays visually consistent with the rest of SMRITI.
export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDangerous = true,
  isSubmitting = false,
  error = '',
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  const handleCancel = () => {
    if (isSubmitting) return;
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={handleCancel} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          className="relative w-full sm:max-w-sm rounded-3xl bg-white p-6 text-left shadow-elevated border border-brand-border"
        >
          <h4 id="confirm-dialog-title" className="font-editorial text-lg font-medium text-brand-charcoal">
            {title}
          </h4>
          {message && <p className="text-xs text-brand-slate mt-2 leading-relaxed">{message}</p>}

          {error && (
            <p role="alert" className="mt-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-2 text-xs">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-brand-border text-brand-slate disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-xl text-white font-semibold disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 ${
                isDangerous ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-teal hover:bg-brand-tealDark'
              }`}
            >
              {isSubmitting && (
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              {isSubmitting ? 'Working…' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
