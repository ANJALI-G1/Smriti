import { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { patientApi } from '../api/client.js';
import Toast from '../components/ui/Toast.jsx';
import PatientHeader from '../components/patient/PatientHeader.jsx';
import MorningHero from '../components/patient/MorningHero.jsx';
import RecognitionGame from '../components/patient/RecognitionGame.jsx';
import AskSmriti from '../components/patient/AskSmriti.jsx';
import MemoryRibbon from '../components/patient/MemoryRibbon.jsx';
import DailyRhythm from '../components/patient/DailyRhythm.jsx';
import CuratedRituals from '../components/patient/CuratedRituals.jsx';
import MemoryOfTheDay from '../components/patient/MemoryOfTheDay.jsx';
import PeopleCloseToYou from '../components/patient/PeopleCloseToYou.jsx';
import OfflineBanner from '../components/patient/OfflineBanner.jsx';
import PatientBottomNav from '../components/patient/PatientBottomNav.jsx';
import PatientLoginModal from '../components/patient/PatientLoginModal.jsx';

export default function PatientPage() {
  const { isAuthenticated, isLoading, user, token, logout } = useAuth();
  const [toastMessage, setToastMessage] = useState('');
  const toastTimeoutRef = useRef(null);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => setToastMessage(''), 2800);
  }, []);

  // Real caregiver-created data for RecognitionGame/MemoryOfTheDay. Fetched
  // once the patient is actually unlocked (no point calling this before
  // there's a patient token) and re-fetchable via `onRetry` on failure.
  const [memoriesState, setMemoriesState] = useState({ status: 'idle', familyMembers: [], memories: [] });
  const isUnlocked = isAuthenticated && user?.role === 'patient';

  const loadMemories = useCallback(async () => {
    setMemoriesState((prev) => ({ ...prev, status: 'loading' }));
    try {
      const { familyMembers, memories } = await patientApi.getMemories(token);
      setMemoriesState({ status: 'success', familyMembers, memories });
    } catch {
      setMemoriesState({ status: 'error', familyMembers: [], memories: [] });
    }
  }, [token]);

  useEffect(() => {
    if (isUnlocked) loadMemories();
  }, [isUnlocked, loadMemories]);

  const handleLogout = () => {
    // Clear the session then reload this same page (not a route change) —
    // the patient should stay put and simply see the login modal reappear.
    logout();
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-ivory text-brand-slate text-sm">
        Loading…
      </div>
    );
  }

  // A caregiver session has no business on the patient tablet view — send
  // them to their own dashboard rather than building a permissions system.
  if (isAuthenticated && user.role === 'caregiver') {
    return <Navigate to="/caregiver" replace />;
  }

  const patientName = isUnlocked ? user.displayName : 'Aiton';

  return (
    <div className="min-h-screen bg-brand-ivory">
      {/* The interface always renders — auth is a modal overlay, not a
          route redirect, per the elderly-friendly UX requirement that the
          patient never gets bounced to a different screen just to log in. */}
      <div
        className={isUnlocked ? '' : 'pointer-events-none select-none opacity-90'}
        aria-hidden={!isUnlocked}
        inert={!isUnlocked}
      >
        <PatientHeader
          patientName={patientName}
          isAuthenticated={isUnlocked}
          onLogout={handleLogout}
          onShowToast={showToast}
        />
        <main className="w-full pt-20 pb-32">
          <MorningHero patientName={patientName} onShowToast={showToast} />
          <RecognitionGame
            status={memoriesState.status}
            familyMembers={memoriesState.familyMembers}
            onRetry={loadMemories}
          />
          <AskSmriti onShowToast={showToast} />
          <MemoryRibbon onShowToast={showToast} />
          <DailyRhythm />
          <CuratedRituals onShowToast={showToast} />
          <MemoryOfTheDay status={memoriesState.status} memories={memoriesState.memories} />
          <PeopleCloseToYou />
          <OfflineBanner />
        </main>
        <PatientBottomNav
          onSelectTab={(tab) =>
            tab !== 'home' && showToast(`"${tab[0].toUpperCase()}${tab.slice(1)}" isn't built yet in this demo.`)
          }
        />
      </div>

      <PatientLoginModal isOpen={!isUnlocked} />
      <Toast message={toastMessage} />
    </div>
  );
}
