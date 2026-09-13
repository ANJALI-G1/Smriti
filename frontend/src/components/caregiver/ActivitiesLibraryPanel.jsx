import Icon from '../ui/Icon.jsx';

// The common Activities/Games library (see backend/models/activities.js's
// ACTIVITY_CATALOG) — one shared definition per game, not something a
// caregiver creates. The only thing a caregiver actually controls here is
// whether a given game is turned on for their patient; the games
// themselves are fixed, reliable, and identical across every patient.
export default function ActivitiesLibraryPanel({ activities, completedToday, onToggle }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <div>
          <h3 className="text-xs font-bold tracking-wider text-brand-slate uppercase">Activities Library</h3>
          <p className="text-[11px] text-brand-slate">
            {completedToday > 0
              ? `Aiton enjoyed ${completedToday} ${completedToday === 1 ? 'activity' : 'activities'} today`
              : 'No activities played yet today'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-3">
        {activities.length === 0 && <p className="text-xs text-brand-slate text-center py-4">No activities available.</p>}

        {activities.map((activity) => (
          <div
            key={activity.type}
            className={`flex items-center justify-between gap-3 p-3 rounded-2xl border transition ${
              activity.enabled ? 'border-brand-border/60 bg-brand-ivory/60' : 'border-brand-border/40 bg-white opacity-60'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-brand-tealSubtle text-brand-teal flex items-center justify-center shrink-0">
                <Icon name={activity.icon} className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h5 className="text-xs font-bold text-brand-charcoal">{activity.title}</h5>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-brand-tealSubtle text-brand-teal">
                    {activity.category}
                  </span>
                </div>
                <p className="text-[11px] text-brand-slate truncate">{activity.instructions}</p>
                <p className="text-[10px] text-brand-muted mt-0.5">
                  {activity.difficulty} · {activity.durationLabel}
                  {activity.usesPersonalData ? ` · Uses ${activity.usesPersonalData}` : ''}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onToggle(activity)}
              role="switch"
              aria-checked={activity.enabled}
              title={activity.enabled ? 'Disable this activity' : 'Enable this activity'}
              className={`shrink-0 w-12 h-7 rounded-full transition-colors relative ${
                activity.enabled ? 'bg-brand-teal' : 'bg-brand-border'
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  activity.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
