export default function AiInsight({ insight, onScrollToTrends, onShowToast }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <h3 className="text-xs font-bold tracking-wider text-brand-slate uppercase">SMRITI Intelligence</h3>
        <span className="text-[11px] font-medium text-brand-teal bg-brand-tealSubtle px-2 py-0.5 rounded-full">
          Non-Clinical Observation
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-brand-border shadow-card">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-brand-tealSubtle text-brand-teal flex items-center justify-center shrink-0 shadow-sm mt-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>

          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-brand-teal uppercase tracking-wider">SMRITI Noticed</span>
              <span className="text-xs text-brand-slate">· {insight.windowLabel}</span>
            </div>

            <h4 className="font-editorial text-xl font-medium text-brand-charcoal">“{insight.headline}”</h4>

            <p className="text-xs text-brand-slate leading-relaxed">{insight.detail}</p>

            <div className="p-3 bg-brand-ivory rounded-xl border border-brand-border text-xs text-brand-charcoal">
              <p className="font-medium text-brand-teal flex items-center gap-1.5 mb-1">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {insight.guardrail}
              </p>
              <p className="text-[11px] text-brand-slate">Suggested action: {insight.suggestedAction}</p>
            </div>

            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={onScrollToTrends}
                className="text-xs font-semibold text-brand-teal hover:text-brand-tealDark flex items-center gap-1 group"
              >
                View detailed trend history
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </button>
              <span className="text-xs text-brand-border">|</span>
              <button
                type="button"
                onClick={() => onShowToast('Prepared a non-clinical summary brief for the next clinic visit.')}
                className="text-xs font-medium text-brand-slate hover:text-brand-charcoal"
              >
                Prepare brief for clinic visit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
