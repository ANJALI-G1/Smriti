import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { caregiverApi, patientApi } from '../../api/client.js';
import { getLocalDateString } from '../../utils/formatDate.js';
import Toast from '../ui/Toast.jsx';
import PatientHeader from './PatientHeader.jsx';
import PatientBottomNav from './PatientBottomNav.jsx';
import PatientLoginModal from './PatientLoginModal.jsx';
import CaregiverPreviewBanner from './CaregiverPreviewBanner.jsx';

// Shared shell for every /patient/* page: auth gating (login modal overlay,
// never a redirect — see PatientLoginModal's usage below), the fixed
// header/bottom nav, toast plumbing, and the one real data fetch that both
// the Home page and the Memories page need. Extracted here so a second
// page didn't have to re-implement all of this — see PatientPage.jsx and
// PatientMemoriesPage.jsx for usage.
//
// A caregiver session is also allowed to render this shell — deliberately,
// as an authenticated "preview" of the patient experience (see
// CaregiverHeader's "Switch to Aiton's Tablet View" button), never a
// bypass of patient auth: it's the caregiver's own already-verified JWT,
// still checked by requireRole('caregiver') server-side, reading data
// through the existing caregiver-only dashboard endpoint — the
// patient-only `/api/patient/*` routes are never touched by this path and
// keep requiring an actual patient token, completely unchanged.
export default function PatientAppShell({ activeTab, children }) {
  const { isAuthenticated, isLoading, user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState('');
  const toastTimeoutRef = useRef(null);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => setToastMessage(''), 2800);
  }, []);

  const [memoriesState, setMemoriesState] = useState({ status: 'idle', familyMembers: [], memories: [] });
  const [routinesState, setRoutinesState] = useState({ status: 'idle', routines: [] });
  const [activitiesState, setActivitiesState] = useState({ status: 'idle', activities: [] });
  const [previewPatientName, setPreviewPatientName] = useState(null);
  const isCaregiverPreview = isAuthenticated && user?.role === 'caregiver';
  const isUnlocked = (isAuthenticated && user?.role === 'patient') || isCaregiverPreview;

  const loadMemories = useCallback(async () => {
    setMemoriesState((prev) => ({ ...prev, status: 'loading' }));
    try {
      if (isCaregiverPreview) {
        // Same real memories/family-members a caregiver already sees on
        // their own dashboard — just reused here for the preview, via the
        // caregiver's own token against the caregiver-only endpoint.
        const dashboard = await caregiverApi.getDashboard(token);
        setPreviewPatientName(dashboard.patient?.name || null);
        setMemoriesState({ status: 'success', familyMembers: dashboard.familyMembers || [], memories: dashboard.memories || [] });
      } else {
        const { familyMembers, memories } = await patientApi.getMemories(token);
        setMemoriesState({ status: 'success', familyMembers, memories });
      }
    } catch {
      setMemoriesState({ status: 'error', familyMembers: [], memories: [] });
    }
  }, [token, isCaregiverPreview]);

  // Always the viewer's own local calendar day (see getLocalDateString) —
  // routine completion is scoped to whichever day this is, never the
  // server's clock, so it can never land on the wrong day near midnight.
  const loadRoutines = useCallback(async () => {
    setRoutinesState((prev) => ({ ...prev, status: 'loading' }));
    const today = getLocalDateString();
    try {
      if (isCaregiverPreview) {
        // Same real routines/completion a caregiver sees on their own
        // dashboard — reused here via their own token, not the patient's.
        const dashboard = await caregiverApi.getDashboard(token, today);
        setRoutinesState({ status: 'success', routines: dashboard.routines || [] });
      } else {
        const { routines } = await patientApi.getRoutines(token, today);
        setRoutinesState({ status: 'success', routines });
      }
    } catch {
      setRoutinesState({ status: 'error', routines: [] });
    }
  }, [token, isCaregiverPreview]);

  // The one action a patient (or a caregiver previewing this view) takes
  // on a routine item — routed to whichever role's own completion
  // endpoint actually applies to the signed-in session, so a caregiver
  // preview never needs (or gets) patient-role access to make this work.
  const completeRoutine = useCallback(
    async (routineId) => {
      const today = getLocalDateString();
      if (isCaregiverPreview) {
        await caregiverApi.completeRoutine(token, routineId, today);
      } else {
        await patientApi.completeRoutine(token, routineId, today);
      }
      await loadRoutines();
    },
    [token, isCaregiverPreview, loadRoutines],
  );

  // The common Activities/Games catalog (see backend/models/activities.js)
  // filtered to whatever's enabled for this patient — a caregiver preview
  // reuses their own dashboard fetch the same way loadRoutines does.
  const loadActivities = useCallback(async () => {
    setActivitiesState((prev) => ({ ...prev, status: 'loading' }));
    try {
      if (isCaregiverPreview) {
        const dashboard = await caregiverApi.getDashboard(token);
        setActivitiesState({ status: 'success', activities: (dashboard.activities || []).filter((a) => a.enabled) });
      } else {
        const { activities } = await patientApi.getActivities(token);
        setActivitiesState({ status: 'success', activities });
      }
    } catch {
      setActivitiesState({ status: 'error', activities: [] });
    }
  }, [token, isCaregiverPreview]);

  // Records that a round of a game was finished — a caregiver previewing
  // the patient view can still play a game end-to-end, but nothing is
  // persisted for it (there's no "caregiver played this for the patient"
  // concept, unlike routine verification), so this only ever calls the
  // real API for an actual patient session.
  const completeActivity = useCallback(
    async (activityType) => {
      if (isCaregiverPreview) return;
      try {
        await patientApi.completeActivity(token, activityType, getLocalDateString());
      } catch {
        // A missed completion log is not worth interrupting the patient's
        // play with an error — the game itself already gave them their
        // gentle "well done" moment regardless.
      }
    },
    [token, isCaregiverPreview],
  );

  useEffect(() => {
    if (isUnlocked) {
      loadMemories();
      loadRoutines();
      loadActivities();
    }
  }, [isUnlocked, loadMemories, loadRoutines, loadActivities]);

  const handleLogout = () => {
    // Clear the session then reload this same page (not a route change) —
    // the patient should stay put and simply see the login modal reappear.
    logout();
    window.location.reload();
  };

  const handleBackToCaregiver = () => navigate('/caregiver');

  const handleSelectTab = (tab) => {
    if (tab === 'home') navigate('/patient');
    else if (tab === 'memories') navigate('/patient/memories');
    else if (tab === 'activities') navigate('/patient/activities');
    else showToast(`"${tab[0].toUpperCase()}${tab.slice(1)}" isn't built yet in this demo.`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-ivory text-brand-slate text-sm">
        Loading…
      </div>
    );
  }

  const patientName = isCaregiverPreview ? previewPatientName || 'Aiton' : isUnlocked ? user.displayName : 'Aiton';

  return (
    <div className="min-h-screen bg-brand-ivory">
      {/* Never shown for the real patient session — only when a caregiver
          is previewing this view, so the actual elderly-facing interface
          stays exactly as calm as before. */}
      {isCaregiverPreview && <CaregiverPreviewBanner onBackToCaregiver={handleBackToCaregiver} />}

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
          onLogout={isCaregiverPreview ? handleBackToCaregiver : handleLogout}
          onShowToast={showToast}
          offsetTop={isCaregiverPreview}
          logoutLabel={isCaregiverPreview ? 'Back to Caregiver' : 'Log out'}
        />
        <main className={`w-full pb-32 ${isCaregiverPreview ? 'pt-[7.25rem]' : 'pt-20'}`}>
          {children({
            patientName,
            isUnlocked,
            showToast,
            memoriesState,
            loadMemories,
            routinesState,
            completeRoutine,
            activitiesState,
            completeActivity,
          })}
        </main>
        <PatientBottomNav activeTab={activeTab} onSelectTab={handleSelectTab} />
      </div>

      <PatientLoginModal isOpen={!isUnlocked} />
      <Toast message={toastMessage} />
    </div>
  );
}
