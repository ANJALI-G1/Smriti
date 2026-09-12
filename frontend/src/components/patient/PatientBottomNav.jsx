const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'memories', label: 'Memories' },
  { id: 'activities', label: 'Activities' },
  { id: 'me', label: 'Me' },
];

export default function PatientBottomNav({ onSelectTab }) {
  return (
    <footer className="fixed bottom-6 inset-x-0 z-30 flex justify-center pointer-events-none px-4">
      <div className="pointer-events-auto bg-white/95 backdrop-blur-xl shadow-elevated rounded-full px-2 py-2 max-w-md w-full">
        <nav className="flex items-center justify-between gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 py-2.5 px-3 rounded-full transition-all font-elderly text-base ${
                tab.id === 'home'
                  ? 'bg-brand-tealSubtle text-brand-teal font-bold shadow-sm'
                  : 'text-brand-slate hover:bg-brand-surface hover:text-brand-charcoal'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </footer>
  );
}
