import Icon from '../ui/Icon.jsx';
import { dailyRhythm } from '../../data/patientMock.js';

const STATE_STYLES = {
  done: { card: 'bg-white', icon: 'checkCircle', iconColor: 'text-brand-positive', label: 'text-brand-positive' },
  active: { card: 'bg-brand-teal text-white shadow-md', icon: null, iconColor: '', label: 'text-white/80 uppercase' },
  upcoming: { card: 'bg-white opacity-85', icon: 'circleOutline', iconColor: 'text-brand-muted', label: 'text-brand-muted' },
  sunset: { card: 'bg-white opacity-85', icon: 'sunset', iconColor: 'text-brand-amber', label: 'text-brand-amber' },
};

export default function DailyRhythm() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 w-full py-16">
      <div className="bg-brand-surface rounded-3xl p-6 sm:p-12 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <Icon name="routine" className="w-6 h-6 text-brand-teal" />
          <h3 className="font-serif text-2xl sm:text-3xl text-brand-teal">Your Rhythm Today</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {dailyRhythm.map((step) => {
            const style = STATE_STYLES[step.state];
            const isActive = step.state === 'active';
            return (
              <div key={step.id} className={`rounded-2xl p-5 shadow-sm flex flex-col justify-between ${style.card}`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold ${isActive ? 'text-white/90 uppercase tracking-wide' : style.label}`}>
                      {step.label}
                    </span>
                    {isActive ? (
                      <span className="w-3 h-3 rounded-full bg-brand-amberLight animate-ping" />
                    ) : (
                      <Icon name={style.icon} className={`w-5 h-5 ${style.iconColor}`} />
                    )}
                  </div>
                  <p className={`font-elderly text-base ${isActive ? 'text-white' : 'text-brand-charcoal'}`}>{step.detail}</p>
                </div>
                <span className={`text-xs mt-4 ${isActive ? 'text-white/70' : 'text-brand-muted'}`}>{step.note}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
