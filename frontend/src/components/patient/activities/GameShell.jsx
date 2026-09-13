import Icon from '../../ui/Icon.jsx';

// The one shared frame every game renders inside: a big "← Back" (always
// visible, so a patient is never stuck inside a game) plus a calm
// full-width card for the game's own content. Deliberately minimal — no
// timers, no scores, no progress bars — the games themselves decide what
// "one task at a time" looks like inside this.
export default function GameShell({ title, onBack, children }) {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-8 w-full py-10">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-brand-border text-brand-teal font-elderly text-lg font-semibold shadow-sm hover:bg-brand-tealSubtle transition-all active:scale-[0.98]"
      >
        <Icon name="chevronLeft" className="w-5 h-5" />
        Back
      </button>

      <div className="bg-brand-surface rounded-3xl p-6 sm:p-10 shadow-sm">
        <h2 className="font-serif text-2xl sm:text-3xl text-brand-teal mb-6">{title}</h2>
        {children}
      </div>
    </section>
  );
}
