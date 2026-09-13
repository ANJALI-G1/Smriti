import { useMemo, useState } from 'react';
import { resolveAssetUrl } from '../../../../api/client.js';
import Icon from '../../../ui/Icon.jsx';
import EmptyState from '../EmptyState.jsx';
import { pickRandom, shuffle } from '../gameUtils.js';

// "People I Know" — real family-member photos only (never a generic
// stand-in person), pulled from the patient's own already-authorized
// memories/family-members data. A round completes the moment they pick
// correctly; "Try Another" just picks a new random person, so this can be
// played over and over without ever running out or feeling finished.
export default function WhoIsThisGame({ familyMembers, onComplete }) {
  const [round, setRound] = useState(0); // bumped to force a fresh target
  const [selectedId, setSelectedId] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect' | null

  const { target, choices } = useMemo(() => {
    if (!familyMembers || familyMembers.length === 0) return { target: null, choices: [] };
    const [first, ...rest] = shuffle(familyMembers);
    const distractors = pickRandom(rest, 2);
    return { target: first, choices: shuffle([first, ...distractors]) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [familyMembers, round]);

  if (!familyMembers || familyMembers.length === 0) {
    return (
      <EmptyState
        icon="face"
        title="No family photos yet"
        description="Once your family adds a photo, they'll appear here for you to recognize together."
      />
    );
  }

  const photoUrl = resolveAssetUrl(target?.photoUrl);

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
    setSelectedId(null);
    setFeedback(null);
    setRound((n) => n + 1);
  };

  return (
    <div className="flex flex-col items-center text-center gap-6">
      <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden bg-white shadow-md flex items-center justify-center text-brand-teal">
        {photoUrl ? (
          <img src={photoUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <Icon name="face" className="w-20 h-20" />
        )}
      </div>

      <p className="font-serif text-2xl text-brand-charcoal">Who is this?</p>

      {choices.length > 1 ? (
        <div className="flex flex-col gap-3 w-full max-w-sm">
          {choices.map((person) => {
            const isSelected = selectedId === person.id;
            const isCorrectPick = feedback === 'correct' && isSelected;
            return (
              <button
                key={person.id}
                type="button"
                onClick={() => handleSelect(person.id)}
                disabled={feedback === 'correct'}
                className={`w-full py-4 px-6 rounded-2xl font-elderly text-xl font-bold shadow-sm transition-all text-center disabled:opacity-100 ${
                  isCorrectPick
                    ? 'bg-brand-positive text-white'
                    : isSelected
                      ? 'bg-brand-amberSubtle text-brand-charcoal'
                      : 'bg-white text-brand-charcoal hover:bg-brand-tealSubtle'
                }`}
              >
                {person.name}
              </button>
            );
          })}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => handleSelect(target.id)}
          className={`w-full max-w-sm py-4 px-6 rounded-2xl font-elderly text-xl font-bold shadow-sm transition-all ${
            feedback === 'correct' ? 'bg-brand-positive text-white' : 'bg-brand-teal text-white hover:bg-brand-tealDark'
          }`}
        >
          {feedback === 'correct' ? `Yes, this is ${target.name}!` : `This is ${target.name}`}
        </button>
      )}

      {feedback === 'incorrect' && (
        <p className="font-elderly text-lg text-brand-slate bg-white px-5 py-3 rounded-2xl">
          That&apos;s okay — this is {target.name}
          {target.relationship ? `, your ${target.relationship}` : ''}. Let&apos;s remember together.
        </p>
      )}

      {feedback === 'correct' && (
        <div className="flex flex-col items-center gap-3">
          <p className="font-elderly text-lg text-brand-positive font-bold">Wonderful!</p>
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
