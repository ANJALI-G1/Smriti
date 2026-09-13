import { useState } from 'react';
import Icon from '../ui/Icon.jsx';
import { deriveRoutineStatus, formatTimeOfDay } from '../../utils/formatDate.js';

// Real, caregiver-managed daily schedule with REAL completion (backed by
// the `routines`/`routine_completions` tables — see
// backend/routes/patient.js) — this used to render a hardcoded mock array
// from data/patientMock.js with fake "active"/"sunset" states and no way
// to actually mark anything done; that mock export is gone now that this
// reads and writes the real thing.
const STATUS_STYLES = {
  completed: { card: 'bg-white border border-brand-positive/30', icon: 'checkCircle', iconColor: 'text-brand-positive', label: 'text-brand-positive' },
  missed: { card: 'bg-white border border-brand-amber/30', icon: 'sunset', iconColor: 'text-brand-amber', label: 'text-brand-amber' },
  pending: { card: 'bg-white border border-brand-border', icon: 'circleOutline', iconColor: 'text-brand-muted', label: 'text-brand-muted' },
};

function CalmMessage({ icon, title, description, onRetry }) {
  return (
    <div className="flex flex-col items-center text-center py-8 gap-4">
      <div className="w-14 h-14 rounded-full bg-white text-brand-teal flex items-center justify-center">
        <Icon name={icon} className="w-7 h-7" />
      </div>
      <h4 className="font-serif text-xl text-brand-teal">{title}</h4>
      <p className="font-elderly text-base text-brand-slate max-w-md">{description}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-6 py-3 rounded-2xl bg-brand-teal text-white font-elderly text-base font-semibold shadow-sm hover:bg-brand-tealDark transition-all"
        >
          Try again
        </button>
      )}
    </div>
  );
}

function RoutineItemCard({ item, onComplete }) {
  const status = deriveRoutineStatus(item);
  const style = STATUS_STYLES[status];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDone = async () => {
    if (isSubmitting || status === 'completed') return;
    setIsSubmitting(true);
    try {
      await onComplete(item.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 justify-between ${style.card}`}>
      <div className="flex items-center gap-4 min-w-0">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${status === 'completed' ? 'bg-brand-positiveTint' : 'bg-brand-surface'}`}>
          <Icon name={style.icon} className={`w-6 h-6 ${style.iconColor}`} />
        </div>
        <div className="min-w-0">
          <span className={`text-xs font-bold uppercase tracking-wide ${style.label}`}>{formatTimeOfDay(item.time)}</span>
          <p className="font-elderly text-lg text-brand-charcoal truncate">{item.title}</p>
          {item.detail && <p className="text-sm text-brand-muted truncate">{item.detail}</p>}
        </div>
      </div>

      {status === 'completed' ? (
        <span className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-positiveTint text-brand-positive font-elderly text-base font-bold">
          <Icon name="checkCircle" className="w-5 h-5" />
          Completed
        </span>
      ) : (
        <button
          type="button"
          onClick={handleDone}
          disabled={isSubmitting}
          className="shrink-0 h-14 px-6 rounded-2xl bg-brand-teal text-white font-elderly text-lg font-bold shadow-sm hover:bg-brand-tealDark active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          <Icon name="checkCircle" className="w-5 h-5" />
          {isSubmitting ? 'Saving…' : "I've Done This"}
        </button>
      )}
    </div>
  );
}

export default function DailyRhythm({ status, routines = [], onComplete }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 w-full py-16">
      <div className="bg-brand-surface rounded-3xl p-6 sm:p-12 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <Icon name="routine" className="w-6 h-6 text-brand-teal" />
          <h3 className="font-serif text-2xl sm:text-3xl text-brand-teal">Your Rhythm Today</h3>
        </div>

        {(status === 'idle' || status === 'loading') && (
          <CalmMessage icon="spa" title="Getting your day ready…" description="Just a moment, this won't take long." />
        )}

        {status === 'error' && (
          <CalmMessage
            icon="leaf"
            title="We couldn't load this right now."
            description="That's alright — nothing is lost. Let's try again in a moment."
          />
        )}

        {status === 'success' && routines.length === 0 && (
          <CalmMessage
            icon="routine"
            title="No plan for today yet"
            description="Once your family sets up your daily rhythm, it will appear here."
          />
        )}

        {status === 'success' && routines.length > 0 && (
          <div className="space-y-4">
            {routines.map((item) => (
              <RoutineItemCard key={item.id} item={item} onComplete={onComplete} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
