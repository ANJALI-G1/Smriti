import { useState } from 'react';

export default function AttentionAlert({ items, onShowToast }) {
  const [reviewedIds, setReviewedIds] = useState([]);

  if (items.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-amber" />
          <h3 className="text-xs font-bold tracking-wider text-brand-amber uppercase">Needs Your Attention</h3>
        </div>
        <span className="text-xs text-brand-slate">{items.length} pending item{items.length > 1 ? 's' : ''}</span>
      </div>

      {items.map((item) => {
        const isReviewed = reviewedIds.includes(item.id);
        return (
          <div
            key={item.id}
            className="bg-brand-amberSubtle rounded-3xl p-6 border border-brand-amber/25 shadow-soft transition hover:shadow-card mb-4 last:mb-0"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-brand-amber text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-amber">Amber Alert</span>
                  <span className="text-xs text-brand-slate">· Scheduled for {item.scheduledFor}</span>
                </div>
                <h4 className="font-editorial text-xl font-medium text-brand-charcoal mt-0.5">{item.title}</h4>

                <div className="mt-3 text-xs text-brand-charcoal space-y-1.5 bg-white/70 p-3.5 rounded-xl border border-brand-amber/15">
                  <p>
                    <strong>What happened:</strong> {item.whatHappened}
                  </p>
                  <p>
                    <strong>Why it matters:</strong> {item.whyItMatters}
                  </p>
                  <p className="text-brand-amber font-medium">
                    <strong>Suggested action:</strong> {item.suggestedAction}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-brand-amber/15 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isReviewed}
                  onClick={() => setReviewedIds((prev) => [...prev, item.id])}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition shadow-sm flex items-center gap-1.5 ${
                    isReviewed ? 'bg-brand-positive text-white cursor-default' : 'bg-brand-amber text-white hover:bg-brand-amberLight'
                  }`}
                >
                  {isReviewed ? (
                    '✓ Reviewed'
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Mark as reviewed
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onShowToast(`Reminder detail: ${item.title} — voice prompt already delivered in Khasi.`)}
                  className="px-3.5 py-2 bg-white text-brand-charcoal hover:bg-brand-ivory border border-brand-border text-xs font-semibold rounded-xl transition"
                >
                  View reminder detail
                </button>
              </div>
              <span className="text-[11px] text-brand-slate italic">Not an emergency notification</span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
