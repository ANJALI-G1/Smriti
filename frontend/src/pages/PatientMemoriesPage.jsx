import { useMemo, useState } from 'react';
import PatientAppShell from '../components/patient/PatientAppShell.jsx';
import OfflineBanner from '../components/patient/OfflineBanner.jsx';
import Icon from '../components/ui/Icon.jsx';
import MemoriesUtilityBar from '../components/patient/memories/MemoriesUtilityBar.jsx';
import MemoriesHeader from '../components/patient/memories/MemoriesHeader.jsx';
import FamiliarToYou from '../components/patient/memories/FamiliarToYou.jsx';
import MemoriesGrid from '../components/patient/memories/MemoriesGrid.jsx';
import PeopleIKnowSection from '../components/patient/memories/PeopleIKnowSection.jsx';
import MemoryDetailModal from '../components/patient/memories/MemoryDetailModal.jsx';

function CalmPageMessage({ icon, title, description, onRetry }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-24 flex flex-col items-center text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-brand-tealSubtle text-brand-teal flex items-center justify-center">
        <Icon name={icon} className="w-8 h-8" />
      </div>
      <h2 className="font-serif text-3xl text-brand-teal">{title}</h2>
      <p className="font-elderly text-lg text-brand-slate max-w-md">{description}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 px-6 py-3 rounded-2xl bg-brand-teal text-white font-elderly text-base font-semibold shadow-sm hover:bg-brand-tealDark transition-all"
        >
          Try again
        </button>
      )}
    </div>
  );
}

function MemoriesContent({ patientName, status, familyMembers, memories, onRetry, onShowToast }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedMemory, setSelectedMemory] = useState(null);

  const counts = useMemo(
    () => ({
      all: memories.length,
      photo: memories.filter((m) => m.type === 'photo').length,
      place: memories.filter((m) => m.type === 'place').length,
      voice: memories.filter((m) => m.type === 'voice').length,
      song: memories.filter((m) => m.type === 'song').length,
    }),
    [memories],
  );

  const filteredMemories = useMemo(
    () => (activeCategory === 'all' ? memories : memories.filter((m) => m.type === activeCategory)),
    [memories, activeCategory],
  );

  if (status === 'idle' || status === 'loading') {
    return <CalmPageMessage icon="spa" title="Getting your memories ready…" description="Just a moment, this won't take long." />;
  }

  if (status === 'error') {
    return (
      <CalmPageMessage
        icon="leaf"
        title="We couldn't load this right now."
        description="That's alright — nothing is lost. Let's try again in a moment."
        onRetry={onRetry}
      />
    );
  }

  if (memories.length === 0) {
    return (
      <>
        <MemoriesUtilityBar onShowToast={onShowToast} />
        <CalmPageMessage
          icon="heart"
          title="No memories here yet"
          description="Once your family adds a photo, story, or song, it will appear here for you to enjoy."
        />
      </>
    );
  }

  return (
    <>
      <MemoriesUtilityBar onShowToast={onShowToast} />
      <MemoriesHeader
        patientName={patientName}
        counts={counts}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />
      {activeCategory === 'all' && <FamiliarToYou memories={memories} onOpen={setSelectedMemory} />}
      <MemoriesGrid memories={filteredMemories} activeCategory={activeCategory} onOpen={setSelectedMemory} />
      <PeopleIKnowSection familyMembers={familyMembers} memories={memories} onShowToast={onShowToast} />
      <OfflineBanner />

      <MemoryDetailModal memory={selectedMemory} onClose={() => setSelectedMemory(null)} />
    </>
  );
}

export default function PatientMemoriesPage() {
  return (
    <PatientAppShell activeTab="memories">
      {({ patientName, showToast, memoriesState, loadMemories }) => (
        <MemoriesContent
          patientName={patientName}
          status={memoriesState.status}
          familyMembers={memoriesState.familyMembers}
          memories={memoriesState.memories}
          onRetry={loadMemories}
          onShowToast={showToast}
        />
      )}
    </PatientAppShell>
  );
}
