import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../../../ui/Icon.jsx';
import { buildVisualPool } from './visualPool.js';
import { pickRandom, shuffle } from '../gameUtils.js';

const PAIR_COUNT = 4; // up to 4 pairs (8 cards) — capped low on purpose, per the "keep it very simple" brief

function buildDeck(pool) {
  const items = pickRandom(pool, Math.min(PAIR_COUNT, pool.length));
  const cards = items.flatMap((item) => [
    { cardId: `${item.id}-a`, itemId: item.id, item },
    { cardId: `${item.id}-b`, itemId: item.id, item },
  ]);
  return { items, cards: shuffle(cards) };
}

function Card({ card, isFlipped, isMatched, onClick }) {
  const revealed = isFlipped || isMatched;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={revealed}
      className={`aspect-square rounded-2xl shadow-sm flex items-center justify-center transition-all disabled:cursor-default ${
        isMatched ? 'bg-brand-positiveTint ring-2 ring-brand-positive' : revealed ? 'bg-white' : 'bg-brand-teal hover:bg-brand-tealDark active:scale-95'
      }`}
    >
      {revealed ? (
        card.item.image ? (
          <img src={card.item.image} alt="" className="w-full h-full object-cover rounded-2xl" />
        ) : (
          <span className="text-4xl sm:text-5xl">{card.item.emoji}</span>
        )
      ) : (
        <Icon name="heart" className="w-8 h-8 text-white/70" />
      )}
    </button>
  );
}

// Classic pairs-matching, capped at a handful of pairs and with no
// mistake tracking shown anywhere — a mismatch just flips back after a
// moment, with nothing counted or displayed against the patient.
export default function MatchPicturesGame({ familyMembers, memories, onComplete }) {
  const [round, setRound] = useState(0);
  const [flippedIds, setFlippedIds] = useState([]);
  const [matchedItemIds, setMatchedItemIds] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const hasCompletedRef = useRef(false);
  const timeoutRef = useRef(null);

  const { items, cards } = useMemo(() => {
    const pool = buildVisualPool(familyMembers, memories);
    return buildDeck(pool);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [familyMembers, memories, round]);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const isComplete = items.length > 0 && matchedItemIds.length === items.length;

  useEffect(() => {
    if (isComplete && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      onComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  const handleCardClick = (card) => {
    if (isChecking || flippedIds.includes(card.cardId) || matchedItemIds.includes(card.itemId)) return;

    const nextFlipped = [...flippedIds, card.cardId];
    setFlippedIds(nextFlipped);

    if (nextFlipped.length === 2) {
      const [firstId, secondId] = nextFlipped;
      const first = cards.find((c) => c.cardId === firstId);
      const second = cards.find((c) => c.cardId === secondId);
      setIsChecking(true);
      if (first.itemId === second.itemId) {
        timeoutRef.current = window.setTimeout(() => {
          setMatchedItemIds((prev) => [...prev, first.itemId]);
          setFlippedIds([]);
          setIsChecking(false);
        }, 500);
      } else {
        timeoutRef.current = window.setTimeout(() => {
          setFlippedIds([]);
          setIsChecking(false);
        }, 900);
      }
    }
  };

  const handlePlayAgain = () => {
    window.clearTimeout(timeoutRef.current);
    setFlippedIds([]);
    setMatchedItemIds([]);
    setIsChecking(false);
    hasCompletedRef.current = false;
    setRound((n) => n + 1);
  };

  if (items.length === 0) return null;

  return (
    <div className="flex flex-col items-center text-center gap-6">
      <p className="font-elderly text-xl text-brand-slate">Find the matching pairs. Take all the time you need.</p>

      <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full max-w-lg">
        {cards.map((card) => (
          <Card
            key={card.cardId}
            card={card}
            isFlipped={flippedIds.includes(card.cardId)}
            isMatched={matchedItemIds.includes(card.itemId)}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>

      {isComplete && (
        <div className="flex flex-col items-center gap-3">
          <p className="font-elderly text-lg text-brand-positive font-bold">All matched — wonderful!</p>
          <button
            type="button"
            onClick={handlePlayAgain}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-brand-teal font-elderly text-base font-semibold shadow-sm hover:bg-brand-tealSubtle transition-all"
          >
            <Icon name="refresh" className="w-5 h-5" />
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
