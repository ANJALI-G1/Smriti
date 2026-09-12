export default function OfflineProvenance({ deviceLedger }) {
  return (
    <section>
      <div className="bg-brand-tealSubtle rounded-3xl p-5 border border-brand-teal/20 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-teal text-white flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <h5 className="font-bold text-brand-teal">Meghalaya Offline Mesh Active</h5>
            <p className="text-brand-charcoal text-[11px] leading-relaxed">
              Photos, voice anchors, and daily routines remain locally preserved on the patient&apos;s tablet
              (IndexedDB). Zero reliance on continuous cloud connectivity during hill weather shifts.
            </p>
            <div className="flex items-center gap-3 pt-1 text-[10px] text-brand-slate flex-wrap">
              <span>
                Device Ledger: <strong className="text-brand-teal">{deviceLedger}</strong>
              </span>
              <span>•</span>
              <span>End-to-End Family Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
