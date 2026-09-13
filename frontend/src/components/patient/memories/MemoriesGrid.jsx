import Icon from '../../ui/Icon.jsx';
import MemoryCard from './MemoryCard.jsx';
import { CATEGORY_FILTERS } from './memoryTypeMeta.js';

export default function MemoriesGrid({ memories, activeCategory, onOpen }) {
  const categoryLabel = CATEGORY_FILTERS.find((c) => c.id === activeCategory)?.label || 'memories';

  if (memories.length === 0) {
    return (
      <section className="w-full px-4 sm:px-8 max-w-7xl mx-auto py-10">
        <div className="bg-white rounded-3xl border border-brand-border p-10 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-brand-tealSubtle text-brand-teal flex items-center justify-center">
            <Icon name="leaf" className="w-6 h-6" />
          </div>
          <p className="font-elderly text-lg text-brand-slate">No {categoryLabel.toLowerCase()} here yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-4 sm:px-8 max-w-7xl mx-auto py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.map((memory) => (
          <MemoryCard key={memory.id} memory={memory} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}
