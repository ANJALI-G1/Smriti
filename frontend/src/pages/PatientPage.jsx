import PatientAppShell from '../components/patient/PatientAppShell.jsx';
import MorningHero from '../components/patient/MorningHero.jsx';
import RecognitionGame from '../components/patient/RecognitionGame.jsx';
import AskSmriti from '../components/patient/AskSmriti.jsx';
import MemoryRibbon from '../components/patient/MemoryRibbon.jsx';
import DailyRhythm from '../components/patient/DailyRhythm.jsx';
import CuratedRituals from '../components/patient/CuratedRituals.jsx';
import MemoryOfTheDay from '../components/patient/MemoryOfTheDay.jsx';
import PeopleCloseToYou from '../components/patient/PeopleCloseToYou.jsx';
import OfflineBanner from '../components/patient/OfflineBanner.jsx';

export default function PatientPage() {
  return (
    <PatientAppShell activeTab="home">
      {({ patientName, showToast, memoriesState, loadMemories, routinesState, completeRoutine }) => (
        <>
          <MorningHero patientName={patientName} onShowToast={showToast} />
          <RecognitionGame
            status={memoriesState.status}
            familyMembers={memoriesState.familyMembers}
            onRetry={loadMemories}
          />
          <AskSmriti onShowToast={showToast} />
          <MemoryRibbon onShowToast={showToast} />
          <DailyRhythm status={routinesState.status} routines={routinesState.routines} onComplete={completeRoutine} />
          <CuratedRituals onShowToast={showToast} />
          <MemoryOfTheDay status={memoriesState.status} memories={memoriesState.memories} />
          <PeopleCloseToYou />
          <OfflineBanner />
        </>
      )}
    </PatientAppShell>
  );
}
