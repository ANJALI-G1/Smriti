import MemoryCard from './MemoryCard.jsx';

// A calm, low-effort entry point before the full grid — one of each kind
// that actually exists, never padded with anything fake. Memories arrive
// newest-first from the API, so `.find` naturally picks the most recent
// of each type.
function pickFamiliar(memories) {
  const picks = [];
  const photo = memories.find((m) => m.type === 'photo');
  const place = memories.find((m) => m.type === 'place');
  const soundish = memories.find((m) => m.type === 'song' || m.type === 'voice');
  if (photo) picks.push(photo);
  if (place) picks.push(place);
  if (soundish) picks.push(soundish);
  return picks;
}

export default function FamiliarToYou({ memories, onOpen }) {
  const featured = pickFamiliar(memories);
  if (featured.length === 0) return null;

  return (
    <section className="w-full px-4 sm:px-8 max-w-7xl mx-auto py-6">
      <div className="mb-5">
        <h2 className="font-serif text-2xl sm:text-3xl text-brand-teal">Familiar to you</h2>
        <p className="font-elderly text-lg text-brand-slate mt-1">Some of the people and places you know best.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featured.map((memory) => (
          <MemoryCard key={memory.id} memory={memory} size="lg" onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}
