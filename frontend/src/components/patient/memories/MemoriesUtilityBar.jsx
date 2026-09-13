import Icon from '../../ui/Icon.jsx';

export default function MemoriesUtilityBar({ onShowToast }) {
  return (
    <section className="w-full px-4 sm:px-8 max-w-7xl mx-auto pt-2 pb-4 flex flex-wrap items-center justify-between gap-3 border-b border-brand-border/60">
      <div className="flex items-center gap-2 text-xs text-brand-slate">
        <span className="w-2.5 h-2.5 rounded-full bg-brand-positive" />
        <span className="font-semibold text-brand-teal">Saved locally on this device</span>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => onShowToast('Reading memories aloud isn’t available yet — it will be added soon.')}
          className="h-11 px-4 rounded-full bg-white border border-brand-border text-brand-teal flex items-center gap-2 hover:bg-brand-tealSubtle transition-colors"
        >
          <Icon name="volume" className="w-4 h-4" />
          <span className="font-elderly text-sm font-semibold hidden sm:inline">Listen aloud</span>
        </button>
        <button
          type="button"
          title="Add a family photo or spoken memory"
          onClick={() => onShowToast('A family member or care worker can add a new memory from the Caregiver Dashboard.')}
          className="h-11 w-11 rounded-full bg-brand-teal text-white flex items-center justify-center hover:bg-brand-tealDark transition-colors"
        >
          <Icon name="photo" className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
