const ICONS = {
  engagement: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
  routine: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
    />
  ),
  memory: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
  mood: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  ),
};

const ICON_STYLES = {
  engagement: 'bg-brand-tealSubtle text-brand-teal',
  routine: 'bg-brand-amberSubtle text-brand-amber',
  memory: 'bg-brand-positiveTint text-brand-positive',
  mood: 'bg-brand-tealSubtle text-brand-teal',
};

const VALUE_STYLES = {
  engagement: 'text-brand-teal',
  routine: 'text-brand-charcoal',
  memory: 'text-brand-positive',
  mood: 'text-brand-teal',
};

export default function TodayStats({ stats }) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <h3 className="text-xs font-bold tracking-wider text-brand-slate uppercase">Today at a Glance</h3>
        <span className="text-xs text-brand-slate">Reflects activity logged until 11:30 AM</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className="bg-white rounded-2xl p-5 border border-brand-border shadow-card hover:border-brand-teal/30 transition"
          >
            <div className="flex items-center justify-between text-xs text-brand-slate mb-2">
              <span className="font-medium">{stat.label}</span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${ICON_STYLES[stat.key]}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {ICONS[stat.key]}
                </svg>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`font-editorial text-3xl font-semibold ${VALUE_STYLES[stat.key]}`}>{stat.value}</span>
              <span className="text-xs font-medium text-brand-slate">{stat.valueSuffix}</span>
            </div>
            <p className={`text-xs mt-2 font-medium flex items-center gap-1 ${stat.warning ? 'text-brand-amber' : 'text-brand-charcoal'}`}>
              {stat.warning && (
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              )}
              {stat.detail}
            </p>
            <p className="text-[11px] text-brand-slate mt-0.5">{stat.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
