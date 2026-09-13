import Icon from '../../ui/Icon.jsx';
import { CATEGORY_FILTERS } from './memoryTypeMeta.js';

export default function MemoriesHeader({ patientName, counts, activeCategory, onSelectCategory }) {
  return (
    <section className="w-full px-4 sm:px-8 max-w-7xl mx-auto pt-8 pb-6">
      <div className="max-w-2xl">
        <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-brand-amber font-bold mb-2">
          <Icon name="heart" className="w-4 h-4" />
          Personal Keepsake Album
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-brand-teal tracking-tight">My Memories</h1>
        <p className="font-elderly text-xl text-brand-slate mt-2">People, places, and moments from {patientName}&apos;s life.</p>
      </div>

      <nav
        aria-label="Memory categories"
        className="flex items-center gap-6 sm:gap-8 mt-8 overflow-x-auto pb-1 border-b border-brand-border"
      >
        {CATEGORY_FILTERS.map((category) => {
          const count = category.id === 'all' ? counts.all : counts[category.id] || 0;
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.id)}
              className={`pb-3 font-elderly text-lg whitespace-nowrap transition-all border-b-2 -mb-px ${
                isActive
                  ? 'text-brand-teal font-bold border-brand-teal'
                  : 'text-brand-slate border-transparent hover:text-brand-teal'
              }`}
            >
              {category.label} ({count})
            </button>
          );
        })}
      </nav>
    </section>
  );
}
