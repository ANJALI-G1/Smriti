import { images } from '../../assets/landingImages.js';

export default function TwoPerspectives() {
  return (
    <section className="py-20 lg:py-28 bg-[#FAF6EE] border-b border-brand-border" id="dual-perspectives">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-semibold tracking-widest text-brand-teal">Two Views, One Heart</span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-brand-charcoal mt-2">
            Harmonized for both sides of care.
          </h2>
          <p className="text-brand-slate text-base mt-3">
            Elderly individuals experience peace and intuitive simplicity. Caregivers receive clarity, continuity,
            and collaborative family tools.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border-2 border-brand-teal/40 p-6 sm:p-8 flex flex-col justify-between shadow-soft">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-brand-border pb-4 flex-wrap gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-brand-teal text-white">
                  Elderly Experience
                </span>
                <span className="text-xs font-mono text-brand-slate">Target: Extreme Ease</span>
              </div>
              <h3 className="font-serif text-2xl text-brand-teal">Simple enough to feel familiar.</h3>
              <p className="text-sm text-brand-slate">
                Zero menus, zero notifications, and zero authentication hurdles. The tablet sits on the living room
                table like a warm wooden photo frame that gently talks.
              </p>
              <div className="p-4 rounded-xl bg-brand-surface/80 border border-brand-border space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-brand-border">
                    <img alt="Rina thumbnail" className="w-full h-full object-cover" src={images.rina} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-brand-charcoal block">Touch to talk with Rina</span>
                    <span className="text-[11px] text-brand-slate">Plays warm audio greeting from grandson/daughter</span>
                  </div>
                </div>
                <div className="w-full py-3 bg-brand-teal text-white text-center font-medium rounded-lg text-xs">
                  One-Touch Routine: &quot;Let&apos;s view morning orchids&quot;
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-brand-border mt-6 flex items-center justify-between text-xs text-brand-slate flex-wrap gap-2">
              <span>Designed with Khasi grandmothers</span>
              <span className="font-semibold text-brand-teal">100% Fail-safe</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-brand-amber/40 p-6 sm:p-8 flex flex-col justify-between shadow-soft">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-brand-border pb-4 flex-wrap gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-brand-amber text-white">
                  Caregiver Portal
                </span>
                <span className="text-xs font-mono text-brand-slate">Target: Quiet Reassurance</span>
              </div>
              <h3 className="font-serif text-2xl text-brand-amber">Clear enough to provide quiet calm.</h3>
              <p className="text-sm text-brand-slate">
                Family members working in distant cities or tending to daily jobs can stay connected to the emotional
                and cognitive well-being of their elders.
              </p>
              <div className="p-4 rounded-xl bg-brand-surface/80 border border-brand-border space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-brand-charcoal gap-2 flex-wrap">
                  <span>● Morning ginger tea ritual:</span>
                  <span className="text-emerald-700 font-bold">Completed (9:15 AM)</span>
                </div>
                <div className="flex justify-between items-center text-brand-charcoal gap-2 flex-wrap">
                  <span>● Orchard photo conversation:</span>
                  <span className="text-brand-teal font-bold">Joyful (12 mins)</span>
                </div>
                <div className="flex justify-between items-center text-brand-charcoal gap-2 flex-wrap">
                  <span>● Evening medication reminder:</span>
                  <span className="text-brand-amber font-bold">Scheduled (7:30 PM)</span>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-brand-border mt-6 flex items-center justify-between text-xs text-brand-slate flex-wrap gap-2">
              <span>Co-developed for ASHA healthcare</span>
              <span className="font-semibold text-brand-amber">No surveillance panic</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
