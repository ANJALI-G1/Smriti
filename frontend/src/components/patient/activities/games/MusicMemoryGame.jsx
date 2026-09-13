import ReminiscenceGame from './ReminiscenceGame.jsx';

// Only real, playable recordings — a 'song' memory with no uploaded audio
// (the app has never supported real audio for that type) is skipped
// rather than shown with a silent, broken player.
export default function MusicMemoryGame({ memories, onComplete }) {
  const songs = (memories || []).filter((m) => m.type === 'voice' && m.audioUrl);

  return (
    <ReminiscenceGame
      memories={songs}
      emptyIcon="music"
      emptyTitle="No recordings yet"
      emptyDescription="Once your family adds a voice memory or song, it will appear here to listen to together."
      prompt="Do you remember this song?"
      showAudio
      onComplete={onComplete}
    />
  );
}
