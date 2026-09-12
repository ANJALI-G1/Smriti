import { images } from '../../assets/landingImages.js';

export default function TodayActivity({ activity, onShowToast }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <h3 className="text-xs font-bold tracking-wider text-brand-slate uppercase">Today&apos;s Cognitive Activity</h3>
        <span className="text-xs text-brand-positive font-medium">Completed at {activity.completedAt}</span>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-brand-border">
            <img src={images.rina} alt="Activity thumbnail" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal bg-brand-tealSubtle px-1.5 py-0.5 rounded">
                {activity.type}
              </span>
              <span className="text-xs text-brand-slate">{activity.durationLabel}</span>
            </div>
            <h4 className="text-sm font-bold text-brand-charcoal mt-0.5">{activity.title}</h4>
            <p className="text-xs text-brand-slate">{activity.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end shrink-0">
          <span className="text-xs font-semibold text-brand-positive flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {activity.outcome}
          </span>
          <button
            type="button"
            onClick={() => onShowToast('Activity log: full session transcript isn’t available in this demo yet.')}
            className="px-3.5 py-1.5 rounded-xl border border-brand-border hover:border-brand-teal text-brand-teal text-xs font-semibold hover:bg-brand-tealSubtle transition"
          >
            View activity log
          </button>
        </div>
      </div>
    </section>
  );
}
