import Icon from '../ui/Icon.jsx';
import { rituals } from '../../data/patientMock.js';

export default function CuratedRituals({ onShowToast }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 w-full py-8">
      <div className="mb-8">
        <span className="text-xs uppercase text-brand-amber tracking-wider font-semibold block mb-1">Quiet Rituals</span>
        <h3 className="font-serif text-2xl sm:text-3xl text-brand-teal">Made For You</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rituals.map((ritual) => (
          <div key={ritual.id} className="bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-tealSubtle flex items-center justify-center text-brand-teal mb-5">
                <Icon name={ritual.icon} className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl text-brand-charcoal mb-2">{ritual.title}</h4>
              <p className="font-elderly text-base text-brand-slate mb-6">{ritual.description}</p>
            </div>
            <div className="flex items-center justify-between pt-4">
              <span className="text-xs text-brand-muted font-semibold">{ritual.duration}</span>
              <button
                type="button"
                onClick={() => onShowToast(`"${ritual.title}" isn't built yet — this is a preview of what's coming.`)}
                className="px-6 py-3 rounded-full bg-brand-teal text-white font-elderly text-base font-semibold shadow-sm hover:bg-brand-tealDark transition-all"
              >
                {ritual.actionLabel}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
