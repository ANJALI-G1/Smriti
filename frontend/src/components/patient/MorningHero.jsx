import { images } from '../../assets/landingImages.js';
import Icon from '../ui/Icon.jsx';

export default function MorningHero({ patientName, onShowToast }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 w-full pt-8 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 flex flex-col items-start">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-surface text-brand-amber text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-amber" />
            YOUR DAY · MEGHALAYA
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-brand-teal tracking-tight mb-4">
            Good morning, {patientName}.
          </h1>
          <p className="font-elderly text-xl sm:text-2xl text-brand-slate mb-4">
            Let&apos;s spend a little time with something familiar.
          </p>
          <div className="flex items-center gap-2 text-brand-muted font-elderly text-base mb-8">
            <Icon name="leaf" className="w-5 h-5" />
            <span>Shillong Hills · Fresh morning mist · Saturday</span>
          </div>

          <button
            type="button"
            onClick={() => onShowToast('Reading this page aloud in Khasi… (voice preview)')}
            className="group flex items-center gap-3 px-6 py-4 rounded-full bg-white text-brand-teal shadow-sm hover:bg-brand-tealSubtle transition-all active:scale-[0.98]"
          >
            <span className="w-9 h-9 rounded-full bg-brand-tealSubtle text-brand-teal flex items-center justify-center shrink-0">
              <Icon name="volume" className="w-5 h-5" />
            </span>
            <span className="font-elderly text-lg font-bold text-brand-charcoal">Listen aloud in Khasi</span>
          </button>
        </div>

        <div className="lg:col-span-6 relative mt-4 lg:mt-0">
          <div className="relative rounded-2xl overflow-hidden shadow-lg bg-brand-surface">
            <img src={images.verandaHills} alt="Your veranda garden in Shillong" className="w-full h-[320px] sm:h-[400px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 text-brand-charcoal shadow-sm">
              <Icon name="deck" className="w-5 h-5 text-brand-amber" />
              <span className="text-xs font-semibold tracking-wide">Your veranda garden · Shillong</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
