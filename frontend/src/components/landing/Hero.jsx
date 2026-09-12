import Button from '../ui/Button.jsx';
import { images } from '../../assets/landingImages.js';

export default function Hero() {
  return (
    <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-amberSubtle border border-brand-amber/20 text-brand-amber text-xs font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-amber" />
              Personal Memory • Adaptive AI • Dignified Independence
            </div>
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-[54px] leading-[1.12] text-brand-teal tracking-tight">
              Technology that remembers <em className="italic font-normal text-brand-charcoal">what matters</em>.
            </h1>
            <p className="text-lg text-brand-slate leading-relaxed font-normal max-w-xl">
              SMRITI weaves personal family memories, cherished voices, and familiar routines together — creating a
              calm, zero-stress cognitive companion for elderly loved ones and the families who walk beside them.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Button as="a" href="#gateway-experience" variant="primary" size="lg">
                <span>Enter SMRITI Experience</span>
                <span className="text-brand-amberSubtle text-lg">→</span>
              </Button>
              <Button as="a" href="#dual-perspectives" variant="secondary" size="lg">
                <span>Compare Tablet &amp; Caregiver View</span>
              </Button>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs text-brand-muted border-t border-brand-border/80">
              <div className="flex items-center gap-2 pt-4 sm:pt-0">
                <svg className="w-4 h-4 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Zero Password Barrier for Seniors</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Offline Hill Terrain Ledger</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-brand-border bg-brand-surface shadow-elevated group">
              <img
                alt="72-year-old Meghalaya grandmother gently touching tablet in warm morning living room"
                className="w-full h-full object-cover aspect-[4/3] transform transition duration-700 group-hover:scale-[1.01]"
                src={images.heroAiton}
              />

              <div className="absolute top-6 left-6 max-w-xs bg-white/95 backdrop-blur-md rounded-xl p-3.5 border border-brand-border shadow-soft flex items-center gap-3 transition-transform hover:-translate-y-0.5">
                <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-brand-amber/30">
                  <img alt="Rina, granddaughter" className="w-full h-full object-cover" src={images.rina} />
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-brand-charcoal flex items-center gap-1.5">
                    <span>Rina • Voice Note</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  </p>
                  <p className="text-brand-slate text-[11px] italic">
                    “Khublei Mei! Remember our warm morning ginger tea?”
                  </p>
                </div>
              </div>

              <div className="absolute bottom-6 right-6 max-w-[260px] bg-brand-teal/95 text-brand-ivory backdrop-blur-md rounded-xl p-3.5 border border-brand-tealLight/40 shadow-soft">
                <div className="flex items-center justify-between text-[11px] font-medium text-brand-amberSubtle uppercase tracking-wider mb-1">
                  <span>Routine Anchor</span>
                  <span className="text-white">2:00 PM</span>
                </div>
                <p className="text-xs font-serif font-medium leading-snug">Warm Ginger Tea &amp; Veranda Sunning</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-white/70">
                  <span>Adaptive reminder</span>
                  <span className="bg-white/20 px-1.5 py-0.5 rounded text-white font-mono">No stress</span>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-brand-amber/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-6 -right-6 w-48 h-48 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-brand-border flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <blockquote className="font-editorial text-2xl sm:text-3xl text-brand-teal font-normal italic">
            “Built around the person. Not around the diagnosis.”
          </blockquote>
          <p className="text-xs tracking-wider uppercase text-brand-slate max-w-xs text-center md:text-right">
            SMRITI is co-designed with grassroots caregivers, ASHA workers, and families across Meghalaya and Assam.
          </p>
        </div>
      </div>
    </section>
  );
}
