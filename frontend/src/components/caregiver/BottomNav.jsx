const ICONS = {
  overview: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  patients: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  memories: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  routine: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  trends: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  alerts: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
};

export default function BottomNav({ onOpenPatients, onOpenMemories, onScrollToTrends, onOpenAlerts }) {
  const items = [
    { key: 'overview', label: 'Overview', active: true, onClick: undefined },
    { key: 'patients', label: 'Patients', onClick: onOpenPatients },
    { key: 'memories', label: 'Memories', onClick: onOpenMemories },
    { key: 'trends', label: 'Trends', onClick: onScrollToTrends },
    { key: 'alerts', label: 'Alerts', onClick: onOpenAlerts, hasDot: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-brand-border py-2 px-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={item.onClick}
            className={`flex flex-col items-center gap-1 px-3 py-1 transition ${
              item.active ? 'text-brand-teal font-semibold' : 'text-brand-slate hover:text-brand-teal'
            }`}
          >
            <div className="w-6 h-6 flex items-center justify-center relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={item.active ? '2.2' : '1.8'} d={ICONS[item.key]} />
              </svg>
              {item.hasDot && <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-brand-amber" />}
            </div>
            <span className="text-[11px]">{item.label}</span>
            <span className={`w-1.5 h-1.5 rounded-full ${item.active ? 'bg-brand-teal' : 'bg-transparent'}`} />
          </button>
        ))}
      </div>
    </nav>
  );
}
