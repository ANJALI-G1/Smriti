import { useMemo, useState } from 'react';
import Icon from '../../../ui/Icon.jsx';
import { buildVisualPool } from './visualPool.js';
import { pickRandom, shuffle } from '../gameUtils.js';

function Tile({ item, size = 'md' }) {
  const dimension = size === 'lg' ? 'w-56 h-56 sm:w-64 sm:h-64' : 'w-full h-32 sm:h-36';
  return (
    <div className={`${dimension} rounded-3xl overflow-hidden bg-white shadow-md flex items-center justify-center`}>
      {item.image ? (
        <img src={item.image} alt="" className="w-full h-full object-cover" />
      ) : (
        <span className={size === 'lg' ? 'text-8xl' : 'text-5xl'}>{item.emoji}</span>
      )}
    </div>
  );
}

export default function RememberPictureGame({ familyMembers, memories, onComplete }) {
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState('looking'); // 'looking' | 'guessing'
  const [selectedId, setSelectedId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const { target, choices } = useMemo(() => {
    const pool = buildVisualPool(familyMembers, memories);
    const [first, ...rest] = shuffle(pool);
    const distractors = pickRandom(rest, Math.min(2, rest.length));
    return { target: first, choices: shuffle([first, ...distractors]) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [familyMembers, memories, round]);

  const handleReady = () => setPhase('guessing');

  const handleSelect = (id) => {
    if (feedback === 'correct') return;
    setSelectedId(id);
    if (id === target.id) {
      setFeedback('correct');
      onComplete();
    } else {
      setFeedback('incorrect');
    }
  };

  const handleTryAnother = () => {
    setPhase('looking');
    setSelectedId(null);
    setFeedback(null);
    setRound((n) => n + 1);
  };

  if (!target) return null;

  if (phase === 'looking') {
    return (
      <div className="flex flex-col items-center text-center gap-6">
        <p className="font-elderly text-xl text-brand-slate">Take a good look at this picture.</p>
        <Tile item={target} size="lg" />
        <button
          type="button"
          onClick={handleReady}
          className="px-8 py-4 rounded-2xl bg-brand-teal text-white font-elderly text-xl font-bold shadow-sm hover:bg-brand-tealDark transition-all active:scale-[0.98]"
        >
          I&apos;m Ready
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center gap-6">
      <p className="font-serif text-2xl text-brand-charcoal">Which one did you see?</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {choices.map((item) => {
          const isSelected = selectedId === item.id;
          const isCorrectPick = feedback === 'correct' && isSelected;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              disabled={feedback === 'correct'}
              className={`rounded-3xl p-2 transition-all disabled:opacity-100 ${
                isCorrectPick ? 'ring-4 ring-brand-positive' : isSelected ? 'ring-4 ring-brand-amber' : ''
              }`}
            >
              <Tile item={item} />
              <p className="font-elderly text-base font-semibold text-brand-charcoal mt-2">{item.label}</p>
            </button>
          );
        })}
      </div>

      {feedback === 'incorrect' && (
        <p className="font-elderly text-lg text-brand-slate bg-white px-5 py-3 rounded-2xl">
          That&apos;s okay. Take another look and try again.
        </p>
      )}

      {feedback === 'correct' && (
        <div className="flex flex-col items-center gap-3">
          <p className="font-elderly text-lg text-brand-positive font-bold">That&apos;s it!</p>
          <button
            type="button"
            onClick={handleTryAnother}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-brand-teal font-elderly text-base font-semibold shadow-sm hover:bg-brand-tealSubtle transition-all"
          >
            <Icon name="refresh" className="w-5 h-5" />
            Try Another
          </button>
        </div>
      )}
    </div>
  );
}
