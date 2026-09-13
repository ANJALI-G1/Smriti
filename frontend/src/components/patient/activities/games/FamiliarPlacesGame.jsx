import ReminiscenceGame from './ReminiscenceGame.jsx';

export default function FamiliarPlacesGame({ memories, onComplete }) {
  const places = (memories || []).filter((m) => m.type === 'place');

  return (
    <ReminiscenceGame
      memories={places}
      emptyIcon="deck"
      emptyTitle="No places saved yet"
      emptyDescription="Once your family adds a place you love, it will appear here to remember together."
      prompt="Do you remember this place?"
      onComplete={onComplete}
    />
  );
}
