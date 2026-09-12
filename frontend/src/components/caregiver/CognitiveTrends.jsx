import { useState } from 'react';

const SPARKLINE_PATHS = {
  memory: { d: 'M 0 16 Q 25 14, 50 15 T 100 14', color: '#2E7D5B' },
  attention: { d: 'M 0 24 Q 30 20, 60 14 T 100 8', color: '#0F5E5E' },
  recognition: { d: 'M 0 10 Q 25 12, 50 10 T 100 11', color: '#2E7D5B' },
  sequencing: { d: 'M 0 18 Q 30 16, 65 17 T 100 15', color: '#5A6565' },
  language: { d: 'M 0 8 Q 30 11, 65 17 T 100 22', color: '#C77700' },
};

const STATUS_TEXT_COLOR = {
  steady: 'text-brand-positive',
  improving: 'text-brand-teal',
  practising: 'text-brand-slate',
  down: 'text-brand-caution',
};

export default function CognitiveTrends({ trends }) {
  const [duration, setDuration] = useState('7d');

  return (
    <section id="trendsSection">
      <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
        <div>
          <h3 className="text-xs font-bold tracking-wider text-brand-slate uppercase">Cognitive Patterns</h3>
          <p className="text-[11px] text-brand-slate">Human trajectories, no clinical scores</p>
        </div>

        <div className="flex items-center bg-brand-border/50 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setDuration('7d')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              duration === '7d' ? 'bg-white text-brand-teal shadow-sm' : 'text-brand-slate hover:text-brand-charcoal'
            }`}
          >
            7 Days
          </button>
          <button
            type="button"
            onClick={() => setDuration('30d')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              duration === '30d' ? 'bg-white text-brand-teal shadow-sm' : 'text-brand-slate hover:text-brand-charcoal'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-5">
        {trends.map((trend, i) => {
          const spark = SPARKLINE_PATHS[trend.key];
          return (
            <div
              key={trend.key}
              className={`flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap ${
                i < trends.length - 1 ? 'pb-3.5 border-b border-brand-border/60' : ''
              }`}
            >
              <div className="w-28">
                <h5 className="text-xs font-semibold text-brand-charcoal">{trend.label}</h5>
                <p className="text-[11px] text-brand-slate">{trend.sublabel}</p>
              </div>

              <div className="w-24 h-7 shrink-0">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
                  <path d={spark.d} fill="none" stroke={spark.color} strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>

              <div className="text-right w-28">
                <span className={`inline-flex items-center gap-1 text-xs font-bold ${STATUS_TEXT_COLOR[trend.status]}`}>
                  {trend.statusLabel}
                </span>
                <p className="text-[10px] text-brand-slate">{trend.note}</p>
              </div>
            </div>
          );
        })}

        <div className="pt-2 text-[11px] text-brand-slate italic text-center border-t border-brand-border/60">
          Trends highlight patterns for caregiver support, never diagnostic scores.
          {duration === '30d' && ' (30-day view uses the same demo dataset for now.)'}
        </div>
      </div>
    </section>
  );
}
