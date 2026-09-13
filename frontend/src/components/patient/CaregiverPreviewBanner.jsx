// Shown only when a caregiver session is viewing /patient (never for the
// real patient session — PatientAppShell only renders this when
// `isCaregiverPreview` is true) so a caregiver always knows which
// experience they're looking at and can get back to their own dashboard
// without getting stuck. Deliberately separate from PatientHeader so the
// actual elderly-facing header never carries this extra chrome.
export default function CaregiverPreviewBanner({ onBackToCaregiver }) {
  return (
    <div className="fixed top-0 inset-x-0 z-40 bg-brand-charcoal text-white text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-9 flex items-center justify-between gap-3">
        <span className="font-semibold tracking-wide">Patient View — Caregiver Preview</span>
        <button
          type="button"
          onClick={onBackToCaregiver}
          className="font-semibold underline underline-offset-2 hover:text-brand-tealSubtle shrink-0"
        >
          ← Back to Caregiver
        </button>
      </div>
    </div>
  );
}
