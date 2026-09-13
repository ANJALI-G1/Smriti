import { useMemo, useState } from 'react';
import Icon from '../../../ui/Icon.jsx';
import { CATEGORIES, GENERIC_ITEMS, itemsInCategory, itemsOutsideCategory } from '../genericContent.js';
import { pickOne, pickRandom, shuffle } from '../gameUtils.js';

// Two gentle recognition modes, alternating at random each round — both
// draw from the same small universal content bank (never personalized,
// by design: this is explicitly the "everyday things anyone would know"
// game). Mode A: "What is this?" (name the pictured thing). Mode B:
// "Which one is a [category]?" (spot the category among pictures).
function buildRound() {
  const mode = Math.random() < 0.5 ? 'name' : 'category';

  if (mode === 'name') {
    const target = pickOne(GENERIC_ITEMS);
    const distractors = pickRandom(
      GENERIC_ITEMS.filter((item) => item.id !== target.id),
      2,
    );
    return {
      mode,
      question: 'What is this?',
      target,
      choices: shuffle([target, ...distractors]),
    };
  }

  const category = pickOne(CATEGORIES);
  const target = pickOne(itemsInCategory(category));
  const distractors = pickRandom(itemsOutsideCategory(category), 2);
  return {
    mode,
    question: `Which one is a ${category.toLowerCase()}?`,
    target,
    choices: shuffle([target, ...distractors]),
  };
}

export default function FamiliarThingsGame({ onComplete }) {
  const [round, setRound] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { mode, question, target, choices } = useMemo(() => buildRound(), [round]);

  const handleSelect = (item) => {
    if (feedback === 'correct') return;
    setSelectedId(item.id);
    if (item.id === target.id) {
      setFeedback('correct');
      onComplete();
    } else {
      setFeedback('incorrect');
    }
  };

  const handleTryAnother = () => {
    setSelectedId(null);
    setFeedback(null);
    setRound((n) => n + 1);
  };

  return (
    <div className="flex flex-col items-center text-center gap-6">
      {mode === 'name' && (
        <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl bg-white shadow-md flex items-center justify-center">
          <span className="text-8xl">{target.emoji}</span>
        </div>
      )}

      <p className="font-serif text-2xl text-brand-charcoal">{question}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {choices.map((item) => {
          const isSelected = selectedId === item.id;
          const isCorrectPick = feedback === 'correct' && isSelected;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              disabled={feedback === 'correct'}
              className={`rounded-3xl p-2 transition-all disabled:opacity-100 ${
                isCorrectPick ? 'ring-4 ring-brand-positive' : isSelected ? 'ring-4 ring-brand-amber' : ''
              }`}
            >
              {mode === 'category' ? (
                <>
                  <div className="w-full h-32 sm:h-36 rounded-3xl bg-white shadow-sm flex items-center justify-center">
                    <span className="text-5xl">{item.emoji}</span>
                  </div>
                  <p className="font-elderly text-base font-semibold text-brand-charcoal mt-2">{item.label}</p>
                </>
              ) : (
                <p className="w-full py-6 rounded-3xl bg-white shadow-sm font-elderly text-xl font-bold text-brand-charcoal">
                  {item.label}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {feedback === 'incorrect' && (
        <p className="font-elderly text-lg text-brand-slate bg-white px-5 py-3 rounded-2xl">
          That&apos;s okay. Let&apos;s try again.
        </p>
      )}

      {feedback === 'correct' && (
        <div className="flex flex-col items-center gap-3">
          <p className="font-elderly text-lg text-brand-positive font-bold">That&apos;s right!</p>
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
