import { deriveRoutineStatus, formatTimeOfDay } from '../../utils/formatDate.js';

const STATUS_STYLES = {
  completed: { row: 'bg-brand-positiveTint', badge: 'bg-brand-positive text-white', label: '✅ Completed' },
  missed: { row: 'bg-brand-amberSubtle border border-brand-amber/30', badge: 'bg-brand-amber text-white', label: '⏳ Missed' },
  pending: { row: 'bg-brand-ivory/60 hover:bg-brand-ivory', badge: 'bg-white text-brand-slate border border-brand-border', label: '⏳ Pending' },
};

// Real, caregiver-managed daily schedule (backed by the `routines` table)
// with REAL completion status (backed by `routine_completions`, joined in
// by the dashboard/GET-routines endpoints for "today") — a routine item is
// only ever "completed" because a `routine_completions` row exists for it
// today, from either the patient tapping Done on their tablet or the
// caregiver's own "Verify" here; "missed" is derived purely from the
// clock (scheduled time already passed, still not done), never a stored
// flag that could go stale. See utils/formatDate.js's deriveRoutineStatus.
// Items arrive pre-sorted chronologically by the API (time is stored as
// 24-hour 'HH:MM', so editing an item's time is how it gets "reordered").
export default function RoutineTimeline({ items, progress, onAddNew, onEdit, onDelete, onVerify, onUnverify }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <div>
          <h3 className="text-xs font-bold tracking-wider text-brand-slate uppercase">Today&apos;s Daily Routine</h3>
          <p className="text-[11px] text-brand-slate">
            {progress.total > 0 ? `Today's Progress: ${progress.completed} / ${progress.total} completed` : "Aiton's day, in order"}
          </p>
        </div>
        <button
          type="button"
          onClick={onAddNew}
          className="text-xs font-semibold text-brand-teal hover:underline flex items-center gap-1"
        >
          + Add routine item
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card">
        {items.length === 0 ? (
          <p className="text-xs text-brand-slate text-center py-4">
            No routine items yet. Use &quot;Add routine item&quot; to build out Aiton&apos;s day.
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const status = deriveRoutineStatus(item);
              const style = STATUS_STYLES[status];
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-xl transition gap-3 flex-wrap group ${style.row}`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="text-xs w-16 shrink-0 font-semibold text-brand-slate">
                      {formatTimeOfDay(item.time)}
                    </span>
                    <div className="min-w-0">
                      <h5 className="text-xs font-semibold text-brand-charcoal truncate">{item.title}</h5>
                      {item.detail && <p className="text-[11px] text-brand-slate truncate">{item.detail}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded whitespace-nowrap ${style.badge}`}>
                      {style.label}
                    </span>
                    {status === 'completed' ? (
                      <button
                        type="button"
                        onClick={() => onUnverify(item)}
                        className="text-[11px] text-brand-slate underline hover:text-brand-charcoal font-medium whitespace-nowrap"
                      >
                        Undo
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onVerify(item)}
                        className="text-[11px] text-brand-teal underline hover:text-brand-tealDark font-medium whitespace-nowrap"
                      >
                        Verify
                      </button>
                    )}
                    <button
                      type="button"
                      title="Edit routine item"
                      onClick={() => onEdit(item)}
                      className="p-2 rounded-lg text-brand-slate hover:text-brand-teal hover:bg-brand-tealSubtle transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      title="Delete routine item"
                      onClick={() => onDelete(item)}
                      className="p-2 rounded-lg text-brand-slate hover:text-red-600 hover:bg-red-50 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
