import { useState } from 'react';

export default function RoutineTimeline({ items, onShowToast }) {
  const [verifiedTimes, setVerifiedTimes] = useState([]);

  return (
    <section>
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <h3 className="text-xs font-bold tracking-wider text-brand-slate uppercase">Today&apos;s Daily Routine</h3>
        <button
          type="button"
          onClick={() => onShowToast("Managing Aiton's daily routine: 5 active daily rituals.")}
          className="text-xs font-semibold text-brand-teal hover:underline flex items-center gap-1"
        >
          Manage routine →
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card">
        <div className="space-y-3">
          {items.map((item) => {
            const isMissed = item.status === 'missed';
            const isVerified = verifiedTimes.includes(item.time);

            if (isMissed && isVerified) {
              return (
                <div key={item.time} className="flex items-center p-3 rounded-xl bg-brand-positiveTint">
                  <span className="text-[11px] font-semibold text-brand-positive px-2 py-0.5 rounded">
                    Checked by caregiver
                  </span>
                </div>
              );
            }

            return (
              <div
                key={item.time}
                className={`flex items-center justify-between p-3 rounded-xl transition gap-3 flex-wrap ${
                  isMissed ? 'bg-brand-amberSubtle border border-brand-amber/30' : 'bg-brand-ivory/60 hover:bg-brand-ivory'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={`text-xs w-16 shrink-0 ${isMissed ? 'font-bold text-brand-amber' : 'font-semibold text-brand-slate'}`}>
                    {item.time}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                      isMissed ? 'bg-brand-amber text-white text-xs' : 'bg-brand-positiveTint text-brand-positive'
                    }`}
                  >
                    {isMissed ? '!' : '✓'}
                  </div>
                  <div>
                    <h5 className={`text-xs ${isMissed ? 'font-bold' : 'font-semibold'} text-brand-charcoal`}>{item.title}</h5>
                    <p className={`text-[11px] ${isMissed ? 'text-brand-amber font-medium' : 'text-brand-slate'}`}>{item.detail}</p>
                  </div>
                </div>
                {isMissed ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-brand-amber bg-white px-2 py-0.5 rounded border border-brand-amber/20">
                      Missed
                    </span>
                    <button
                      type="button"
                      onClick={() => setVerifiedTimes((prev) => [...prev, item.time])}
                      className="text-xs text-brand-teal underline hover:text-brand-tealDark font-medium"
                    >
                      Verify
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] font-medium text-brand-positive bg-brand-positiveTint px-2 py-0.5 rounded">
                    Done
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
