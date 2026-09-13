import { useState } from 'react';
import PatientAppShell from '../components/patient/PatientAppShell.jsx';
import ActivityCard from '../components/patient/activities/ActivityCard.jsx';
import GameShell from '../components/patient/activities/GameShell.jsx';
import WhoIsThisGame from '../components/patient/activities/games/WhoIsThisGame.jsx';
import FamiliarPlacesGame from '../components/patient/activities/games/FamiliarPlacesGame.jsx';
import MusicMemoryGame from '../components/patient/activities/games/MusicMemoryGame.jsx';
import RememberPictureGame from '../components/patient/activities/games/RememberPictureGame.jsx';
import MatchPicturesGame from '../components/patient/activities/games/MatchPicturesGame.jsx';
import FamiliarThingsGame from '../components/patient/activities/games/FamiliarThingsGame.jsx';
import LetsTalkGame from '../components/patient/activities/games/LetsTalkGame.jsx';
import Icon from '../components/ui/Icon.jsx';

// One game component per common activity `type` (see
// backend/models/activities.js's ACTIVITY_CATALOG) — each is handed the
// patient's own already-authorized memories/family-members and an
// onComplete callback, and owns its entire "one task at a time" screen.
const GAME_COMPONENTS = {
  who_is_this: WhoIsThisGame,
  familiar_places: FamiliarPlacesGame,
  music_memory: MusicMemoryGame,
  remember_picture: RememberPictureGame,
  match_pictures: MatchPicturesGame,
  familiar_things: FamiliarThingsGame,
  lets_talk: LetsTalkGame,
};

function CalmMessage({ icon, title, description, onRetry }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 flex flex-col items-center text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-brand-tealSubtle text-brand-teal flex items-center justify-center">
        <Icon name={icon} className="w-8 h-8" />
      </div>
      <h2 className="font-serif text-2xl text-brand-teal">{title}</h2>
      <p className="font-elderly text-lg text-brand-slate">{description}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-6 py-3 rounded-2xl bg-brand-teal text-white font-elderly text-base font-semibold shadow-sm hover:bg-brand-tealDark transition-all"
        >
          Try again
        </button>
      )}
    </div>
  );
}

function ActivitiesContent({ patientName, memoriesState, loadMemories, activitiesState, completeActivity }) {
  const [activeType, setActiveType] = useState(null);
  // Session-only, gentle positive feedback — never a score, never fetched
  // as an authoritative history (see requirements: "light progress" like
  // "you completed 3 activities today," not a percentage or clinical count).
  const [completedCount, setCompletedCount] = useState(0);

  const handleComplete = (type) => {
    setCompletedCount((n) => n + 1);
    completeActivity(type);
  };

  if (activitiesState.status === 'idle' || activitiesState.status === 'loading') {
    return <CalmMessage icon="spa" title="Getting your activities ready…" description="Just a moment, this won't take long." />;
  }

  if (activitiesState.status === 'error') {
    return (
      <CalmMessage
        icon="leaf"
        title="We couldn't load this right now."
        description="That's alright — nothing is lost. Let's try again in a moment."
      />
    );
  }

  if (activeType) {
    const activity = activitiesState.activities.find((a) => a.type === activeType);
    const GameComponent = GAME_COMPONENTS[activeType];
    if (!activity || !GameComponent) {
      setActiveType(null);
      return null;
    }
    return (
      <GameShell title={activity.title} onBack={() => setActiveType(null)}>
        <GameComponent
          familyMembers={memoriesState.familyMembers}
          memories={memoriesState.memories}
          onComplete={() => handleComplete(activeType)}
        />
      </GameShell>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-8 w-full py-10">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl text-brand-teal">Activities</h1>
        <p className="font-elderly text-xl text-brand-slate mt-2">
          A few gentle things to enjoy, {patientName}. No wrong answers, no rush.
        </p>
        {completedCount > 0 && (
          <p className="font-elderly text-base text-brand-positive font-semibold mt-3">
            You&apos;ve enjoyed {completedCount} {completedCount === 1 ? 'activity' : 'activities'} today.
          </p>
        )}
      </div>

      {memoriesState.status === 'error' && (
        <div className="mb-6">
          <CalmMessage
            icon="leaf"
            title="Some memories couldn't load."
            description="Games that use your photos may show fewer choices right now."
            onRetry={loadMemories}
          />
        </div>
      )}

      {activitiesState.activities.length === 0 ? (
        <CalmMessage
          icon="heart"
          title="No activities available yet"
          description="Check back soon — your family can turn on activities for you from the caregiver dashboard."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {activitiesState.activities.map((activity) => (
            <ActivityCard key={activity.type} activity={activity} onSelect={() => setActiveType(activity.type)} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function PatientActivitiesPage() {
  return (
    <PatientAppShell activeTab="activities">
      {({ patientName, memoriesState, loadMemories, activitiesState, completeActivity }) => (
        <ActivitiesContent
          patientName={patientName}
          memoriesState={memoriesState}
          loadMemories={loadMemories}
          activitiesState={activitiesState}
          completeActivity={completeActivity}
        />
      )}
    </PatientAppShell>
  );
}
