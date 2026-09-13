import { useState } from 'react';
import { resolveAssetUrl } from '../../../../api/client.js';
import Icon from '../../../ui/Icon.jsx';
import EmptyState from '../EmptyState.jsx';
import { pickOne } from '../gameUtils.js';

// Shared by Music Memory and Familiar Places — both are the same shape:
// show one of the patient's own real memories of a given type, ask a
// gentle reminiscence question, and offer three no-pressure responses.
// There is no "right" answer here at all, so "completing" just means
// they engaged with it (❤️ or 🙂), not that they answered correctly.
export default function ReminiscenceGame({
  memories,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  prompt,
  showAudio = false,
  onComplete,
}) {
  const [current, setCurrent] = useState(() => pickOne(memories));
  const [response, setResponse] = useState(null);

  if (!memories || memories.length === 0) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />;
  }

  const imageUrl = resolveAssetUrl(current?.imageUrl) || resolveAssetUrl(current?.familyMemberPhotoUrl);
  const audioUrl = showAudio ? resolveAssetUrl(current?.audioUrl) : null;

  const handleNext = () => {
    // Avoid immediately repeating the same one when there's a choice.
    const others = memories.filter((m) => m.id !== current?.id);
    setCurrent(pickOne(others.length > 0 ? others : memories));
    setResponse(null);
  };

  const handleRespond = (value) => {
    setResponse(value);
    if (value !== 'next') onComplete();
  };

  return (
    <div className="flex flex-col items-center text-center gap-6">
      <div className="w-full h-56 sm:h-64 rounded-3xl overflow-hidden bg-white shadow-md flex items-center justify-center text-brand-teal">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <Icon name={emptyIcon} className="w-16 h-16" />
        )}
      </div>

      <div>
        <h3 className="font-serif text-2xl text-brand-charcoal">{current?.title}</h3>
        {current?.description && <p className="font-elderly text-lg text-brand-slate mt-2">{current.description}</p>}
      </div>

      {audioUrl && (
        <div className="w-full max-w-sm">
          <audio controls src={audioUrl} className="w-full h-12" />
        </div>
      )}

      <p className="font-elderly text-xl text-brand-teal font-bold">{prompt}</p>

      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 w-full max-w-md">
        <button
          type="button"
          onClick={() => handleRespond('remember')}
          className={`flex-1 min-w-[9rem] py-4 px-5 rounded-2xl font-elderly text-lg font-bold shadow-sm transition-all flex items-center justify-center gap-2 ${
            response === 'remember' ? 'bg-brand-positive text-white' : 'bg-white text-brand-charcoal hover:bg-brand-tealSubtle'
          }`}
        >
          <Icon name="heart" className="w-5 h-5" />I remember
        </button>
        <button
          type="button"
          onClick={() => handleRespond('maybe')}
          className={`flex-1 min-w-[9rem] py-4 px-5 rounded-2xl font-elderly text-lg font-bold shadow-sm transition-all flex items-center justify-center gap-2 ${
            response === 'maybe' ? 'bg-brand-positive text-white' : 'bg-white text-brand-charcoal hover:bg-brand-tealSubtle'
          }`}
        >
          <Icon name="smile" className="w-5 h-5" />
          Maybe
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex-1 min-w-[9rem] py-4 px-5 rounded-2xl font-elderly text-lg font-bold bg-brand-teal text-white shadow-sm hover:bg-brand-tealDark transition-all flex items-center justify-center gap-2"
        >
          Next
          <Icon name="arrowRight" className="w-5 h-5" />
        </button>
      </div>

      {(response === 'remember' || response === 'maybe') && (
        <p className="font-elderly text-lg text-brand-charcoal bg-white px-5 py-3 rounded-2xl">
          {response === 'remember' ? 'That warms the heart.' : "That's alright — some memories are quieter than others."}
        </p>
      )}
    </div>
  );
}
