import { images } from '../../assets/landingImages.js';

export default function ZeroPressureComparison() {
  return (
    <section className="py-20 lg:py-28 bg-white border-b border-brand-border" id="personal-memory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-semibold tracking-widest text-brand-amber">
            Adaptive Recall Engine
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-brand-teal mt-2">
            Every person remembers differently.
          </h2>
          <p className="text-brand-slate text-base mt-3">
            See how SMRITI fundamentally rethinks cognitive stimulation. Contrast anxiety-inducing clinical
            evaluations with compassionate contextual memory scaffolding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="rounded-2xl border border-red-200 bg-red-50/30 p-8 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-red-100 text-red-800 uppercase tracking-wider">
                  Traditional Method
                </span>
                <span className="text-xs font-mono text-red-700">High Anxiety Vector</span>
              </div>
              <h3 className="font-serif text-2xl text-red-950">Clinical Testing &amp; Scoring</h3>
              <div className="space-y-3 text-sm text-red-900/80">
                <div className="p-3.5 bg-white/80 rounded-lg border border-red-200 flex items-start gap-3">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>Ticking countdown timers and stressful pop quizzes that induce cognitive panic.</span>
                </div>
                <div className="p-3.5 bg-white/80 rounded-lg border border-red-200 flex items-start gap-3">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>
                    Generic western stock images completely alien to Indian elders (e.g. subway cars, generic parks).
                  </span>
                </div>
                <div className="p-3.5 bg-white/80 rounded-lg border border-red-200 flex items-start gap-3">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>
                    Blunt numeric failure scores (e.g., “Score: 12/30 — Deficit Detected”) that depress loved ones.
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-red-200 text-xs text-red-800 italic">
              Result: Senior avoids using the tablet due to fear of failure.
            </div>
          </div>

          <div className="rounded-2xl border-2 border-brand-teal bg-brand-surface/30 p-8 flex flex-col justify-between shadow-soft">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-brand-teal text-white uppercase tracking-wider">
                  SMRITI Human-Centered AI
                </span>
                <span className="text-xs font-mono text-brand-teal">Zero Score • 100% Dignity</span>
              </div>
              <h3 className="font-serif text-2xl text-brand-charcoal">Adaptive Contextual Scaffolding</h3>
              <div className="space-y-3.5 text-sm">
                <div className="p-3.5 bg-white rounded-lg border border-brand-border flex items-center gap-3">
                  <img
                    alt="Rina micro thumbnail"
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                    src={images.rina}
                  />
                  <div>
                    <span className="text-xs font-semibold text-brand-charcoal block">Step 1: Familiar Photo Display</span>
                    <span className="text-xs text-brand-slate">Aiton pauses for 4 seconds looking at the portrait.</span>
                  </div>
                </div>
                <div className="p-3.5 bg-brand-amberSubtle/70 rounded-lg border border-brand-amber/30 flex items-start gap-3">
                  <span className="text-brand-amber font-bold">✦</span>
                  <div>
                    <span className="text-xs font-semibold text-brand-amber block">
                      Step 2: Compassionate Voice Scaffolding
                    </span>
                    <p className="text-xs text-brand-charcoal italic mt-0.5">
                      “Remember who wore this mustard cardigan when picking sweet apples with you in the orchard?”
                    </p>
                  </div>
                </div>
                <div className="p-3.5 bg-white rounded-lg border border-brand-border flex items-start gap-3">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <div>
                    <span className="text-xs font-semibold text-brand-charcoal block">Step 3: Joyful Recognition</span>
                    <span className="text-xs text-brand-slate">“Ah, my sweet Rina!” No fail state, only preserved warmth.</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-brand-border text-xs text-brand-teal font-medium flex items-center justify-between gap-2 flex-wrap">
              <span>Result: Loved one looks forward to morning tablet time.</span>
              <span className="text-brand-amber font-bold">Preserves Identity</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
