import { images } from '../../assets/landingImages.js';
import Icon from '../ui/Icon.jsx';
import { memoryKeepsakes } from '../../data/patientMock.js';

export default function MemoryRibbon({ onShowToast }) {
  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 gap-2">
          <div>
            <span className="text-xs uppercase text-brand-amber tracking-wider font-semibold block mb-1">
              Treasured Keepsakes
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-brand-teal">From Your Memories</h3>
          </div>
          <p className="font-elderly text-base text-brand-slate">Photographs and songs that bring quiet comfort</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {memoryKeepsakes.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
              {item.imageKey ? (
                <div className="relative h-44 overflow-hidden bg-brand-surface">
                  <img src={images[item.imageKey]} alt="" className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-xs font-semibold text-brand-charcoal">
                    {item.type}
                  </span>
                </div>
              ) : (
                <div className="relative h-44 bg-brand-positiveTint flex flex-col items-center justify-center text-brand-positive p-6 text-center">
                  <Icon name="disc" className="w-9 h-9 mb-2" />
                  <span className="font-serif text-lg text-brand-charcoal">{item.title}</span>
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/70 text-xs font-semibold text-brand-positive">
                    {item.type}
                  </span>
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-lg text-brand-charcoal mb-1">{item.title}</h4>
                  <p className="font-elderly text-sm text-brand-slate">{item.detail}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onShowToast(`Opening "${item.title}" — full memory view isn't built yet in this demo.`)}
                  className="mt-4 pt-3 flex items-center gap-2 text-brand-teal font-elderly text-sm font-semibold"
                >
                  <span>{item.actionLabel}</span>
                  <Icon name="arrowRight" className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
