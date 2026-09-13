import { useState } from 'react';
import { resolveAssetUrl } from '../../../../api/client.js';
import Icon from '../../../ui/Icon.jsx';
import EmptyState from '../EmptyState.jsx';
import { pickOne } from '../gameUtils.js';

// Not really a "game" at all — a memory to look at and talk about with
// whoever's nearby. There is no answer to get right or wrong, so the
// only actions are "move to another memory" and "I'm done talking about
// this one," which is the only thing that counts as completing it.
export default function LetsTalkGame({ memories, onComplete }) {
  const [current, setCurrent] = useState(() => pickOne(memories));
  const [done, setDone] = useState(false);

  if (!memories || memories.length === 0) {
    return (
      <EmptyState
        icon="heart"
        title="No memories yet"
        description="Once your family adds a photo, place, or story, it will appear here to talk about together."
      />
    );
  }

  const imageUrl = resolveAssetUrl(current?.imageUrl) || resolveAssetUrl(current?.familyMemberPhotoUrl);
  const audioUrl = current?.type === 'voice' ? resolveAssetUrl(current?.audioUrl) : null;
  const displayName = current?.familyMemberName || current?.title;

  const handleNext = () => {
    const others = memories.filter((m) => m.id !== current?.id);
    setCurrent(pickOne(others.length > 0 ? others : memories));
    setDone(false);
  };

  const handleDone = () => {
    setDone(true);
    onComplete();
  };

  return (
    <div className="flex flex-col items-center text-center gap-6">
      <div className="w-full h-56 sm:h-64 rounded-3xl overflow-hidden bg-white shadow-md flex items-center justify-center text-brand-teal">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <Icon name="heart" className="w-16 h-16" />
        )}
      </div>

      <div>
        <h3 className="font-serif text-2xl text-brand-charcoal">{displayName}</h3>
        {current?.description && <p className="font-elderly text-lg text-brand-slate mt-2">{current.description}</p>}
      </div>

      {audioUrl && (
        <div className="w-full max-w-sm">
          <audio controls src={audioUrl} className="w-full h-12" />
        </div>
      )}

      <p className="font-serif text-2xl text-brand-teal">Tell me about this.</p>
      <p className="font-elderly text-base text-brand-muted -mt-3">
        There&apos;s nothing to get right here — just a memory to enjoy.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <button
          type="button"
          onClick={handleDone}
          className={`flex-1 py-4 px-5 rounded-2xl font-elderly text-lg font-bold shadow-sm transition-all flex items-center justify-center gap-2 ${
            done ? 'bg-brand-positive text-white' : 'bg-brand-teal text-white hover:bg-brand-tealDark'
          }`}
        >
          <Icon name="heart" className="w-5 h-5" />
          {done ? 'Lovely' : 'That was nice'}
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex-1 py-4 px-5 rounded-2xl font-elderly text-lg font-bold bg-white text-brand-charcoal shadow-sm hover:bg-brand-tealSubtle transition-all flex items-center justify-center gap-2"
        >
          Next memory
          <Icon name="arrowRight" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
