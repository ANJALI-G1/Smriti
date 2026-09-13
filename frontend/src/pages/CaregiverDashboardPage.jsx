import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { ApiError, caregiverApi } from '../api/client.js';
import { getLocalDateString } from '../utils/formatDate.js';
import Toast from '../components/ui/Toast.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import CaregiverHeader from '../components/caregiver/CaregiverHeader.jsx';
import PatientHero from '../components/caregiver/PatientHero.jsx';
import TodayStats from '../components/caregiver/TodayStats.jsx';
import AttentionAlert from '../components/caregiver/AttentionAlert.jsx';
import AiInsight from '../components/caregiver/AiInsight.jsx';
import RoutineTimeline from '../components/caregiver/RoutineTimeline.jsx';
import TodayActivity from '../components/caregiver/TodayActivity.jsx';
import CognitiveTrends from '../components/caregiver/CognitiveTrends.jsx';
import MemoryBank from '../components/caregiver/MemoryBank.jsx';
import FamilyMembersPanel from '../components/caregiver/FamilyMembersPanel.jsx';
import ActivitiesLibraryPanel from '../components/caregiver/ActivitiesLibraryPanel.jsx';
import OfflineProvenance from '../components/caregiver/OfflineProvenance.jsx';
import FloatingAddButton from '../components/caregiver/FloatingAddButton.jsx';
import BottomNav from '../components/caregiver/BottomNav.jsx';
import AddMemoryModal from '../components/caregiver/AddMemoryModal.jsx';
import FamilyMemberModal from '../components/caregiver/FamilyMemberModal.jsx';
import RoutineItemModal from '../components/caregiver/RoutineItemModal.jsx';

const FRIENDLY_DELETE_ERROR = "That couldn't be deleted right now. Please try again.";

export default function CaregiverDashboardPage() {
  const { token, logout } = useAuth();

  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  // Bumped every time a modal is opened (create or edit) so it always
  // remounts with fresh state — otherwise reopening "create" repeatedly
  // would reuse the same key and keep whatever was left in the form.
  const [memoryModalSession, setMemoryModalSession] = useState(0);

  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [personModalSession, setPersonModalSession] = useState(0);

  const [isAddRoutineOpen, setIsAddRoutineOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [routineModalSession, setRoutineModalSession] = useState(0);

  // Shared confirm dialog for "delete memory", "delete person", and
  // "delete routine item" — { kind, target, title, message } or null.
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const toastTimeoutRef = useRef(null);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => setToastMessage(''), 2800);
  }, []);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      // Always the caregiver's own local calendar day — routine completion
      // is scoped to whichever day this is, never the server's clock (see
      // utils/formatDate.js's getLocalDateString and backend/routes/caregiver.js).
      const result = await caregiverApi.getDashboard(token, getLocalDateString());
      setData(result);
    } catch {
      setError('We could not load the dashboard right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleLogout = () => {
    // Clear the session, then do a full page navigation rather than
    // React Router's navigate(). A client-side navigate races ProtectedRoute's
    // own auth-driven redirect (both fire off the same state update) and can
    // land on /login?redirect=/caregiver instead of the landing page; a full
    // reload sidesteps that SPA race entirely and is fine for a logout action.
    logout();
    window.location.assign('/');
  };

  const scrollToTrends = () => {
    document.getElementById('trendsSection')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openAddMemory = () => {
    setEditingMemory(null);
    setIsAddMemoryOpen(true);
    setMemoryModalSession((n) => n + 1);
  };

  const openEditMemory = (memory) => {
    setEditingMemory(memory);
    setMemoryModalSession((n) => n + 1);
  };

  const openAddPerson = () => {
    setEditingPerson(null);
    setIsAddPersonOpen(true);
    setPersonModalSession((n) => n + 1);
  };

  const openEditPerson = (person) => {
    setEditingPerson(person);
    setPersonModalSession((n) => n + 1);
  };

  const openAddRoutine = () => {
    setEditingRoutine(null);
    setIsAddRoutineOpen(true);
    setRoutineModalSession((n) => n + 1);
  };

  const openEditRoutine = (routine) => {
    setEditingRoutine(routine);
    setRoutineModalSession((n) => n + 1);
  };

  // The caregiver's own "verify"/"mark done" action — writes to the exact
  // same routine_completions row a patient tapping Done on their tablet
  // would (see backend/routes/caregiver.js and routes/patient.js), so
  // re-fetching the dashboard afterward is the only "sync" needed: there's
  // no separate caregiver-only completion state to keep in step.
  const handleVerifyRoutine = async (routine) => {
    try {
      await caregiverApi.completeRoutine(token, routine.id, getLocalDateString());
      await loadDashboard();
    } catch {
      showToast("Couldn't mark that as done right now. Please try again.");
    }
  };

  const handleUnverifyRoutine = async (routine) => {
    try {
      await caregiverApi.uncompleteRoutine(token, routine.id, getLocalDateString());
      await loadDashboard();
    } catch {
      showToast("Couldn't undo that right now. Please try again.");
    }
  };

  const handleToggleActivity = async (activity) => {
    try {
      await caregiverApi.setActivityEnabled(token, activity.type, !activity.enabled);
      await loadDashboard();
    } catch {
      showToast("Couldn't update that activity right now. Please try again.");
    }
  };

  const requestDeleteMemory = (memory) => {
    setDeleteError('');
    setPendingDelete({
      kind: 'memory',
      target: memory,
      title: 'Delete this memory?',
      message: `"${memory.title}" will be permanently removed from ${data?.patient?.name || 'the'}'s memory bank, along with its photo if it has one. This can't be undone.`,
    });
  };

  const requestDeletePerson = (person) => {
    setDeleteError('');
    const memoryNote =
      person.memoryCount > 0
        ? ` ${person.memoryCount === 1 ? 'One memory' : `${person.memoryCount} memories`} linked to them will keep their titles and details, but will no longer be linked to a person.`
        : '';
    setPendingDelete({
      kind: 'familyMember',
      target: person,
      title: `Remove ${person.name}?`,
      message: `${person.name} will be removed from the memory bank's people.${memoryNote} This can't be undone.`,
    });
  };

  const requestDeleteRoutine = (routine) => {
    setDeleteError('');
    setPendingDelete({
      kind: 'routine',
      target: routine,
      title: 'Delete this routine item?',
      message: `"${routine.title}" will be removed from Aiton's daily routine. This can't be undone.`,
    });
  };

  const cancelDelete = () => {
    if (isDeleting) return;
    setPendingDelete(null);
    setDeleteError('');
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      if (pendingDelete.kind === 'memory') {
        await caregiverApi.deleteMemory(token, pendingDelete.target.id);
        showToast('Memory deleted.');
      } else if (pendingDelete.kind === 'familyMember') {
        await caregiverApi.deleteFamilyMember(token, pendingDelete.target.id);
        showToast(`${pendingDelete.target.name} removed.`);
      } else {
        await caregiverApi.deleteRoutine(token, pendingDelete.target.id);
        showToast('Routine item deleted.');
      }
      setPendingDelete(null);
      await loadDashboard();
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : FRIENDLY_DELETE_ERROR);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-ivory text-brand-slate text-sm">
        Loading Aiton&apos;s dashboard…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-ivory text-center px-4 gap-4">
        <p className="text-brand-charcoal text-sm max-w-sm">{error || 'Something went wrong.'}</p>
        <button
          type="button"
          onClick={loadDashboard}
          className="px-4 py-2 rounded-lg bg-brand-teal text-white text-sm font-medium hover:bg-brand-tealDark"
        >
          Retry
        </button>
      </div>
    );
  }

  const familyMembers = data.familyMembers || [];

  return (
    <div className="min-h-screen flex flex-col bg-brand-ivory pb-24 md:pb-16">
      <CaregiverHeader
        patient={data.patient}
        patients={data.patients}
        caregiverName={data.caregiver.name}
        onLogout={handleLogout}
        onShowToast={showToast}
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <PatientHero patient={data.patient} caregiverName={data.caregiver.name} />
        <TodayStats stats={data.todayStats} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            <AttentionAlert items={data.attentionItems} onShowToast={showToast} />
            <AiInsight insight={data.aiInsight} onScrollToTrends={scrollToTrends} onShowToast={showToast} />
            <RoutineTimeline
              items={data.routines}
              progress={data.routineProgress}
              onAddNew={openAddRoutine}
              onEdit={openEditRoutine}
              onDelete={requestDeleteRoutine}
              onVerify={handleVerifyRoutine}
              onUnverify={handleUnverifyRoutine}
            />
            <TodayActivity activity={data.todayActivity} onShowToast={showToast} />
          </div>

          <div className="lg:col-span-5 space-y-8">
            <CognitiveTrends trends={data.cognitiveTrends} />
            <MemoryBank
              memories={data.memories}
              onAddNew={openAddMemory}
              onEdit={openEditMemory}
              onDelete={requestDeleteMemory}
            />
            <FamilyMembersPanel
              familyMembers={familyMembers}
              onAddNew={openAddPerson}
              onEdit={openEditPerson}
              onDelete={requestDeletePerson}
            />
            <ActivitiesLibraryPanel
              activities={data.activities || []}
              completedToday={data.activitiesCompletedToday || 0}
              onToggle={handleToggleActivity}
            />
            <OfflineProvenance deviceLedger={data.deviceLedger} />
          </div>
        </div>
      </main>

      <FloatingAddButton onClick={openAddMemory} />
      <BottomNav
        onOpenPatients={() => showToast('Use the patient selector at the top of the page to switch patients.')}
        onOpenMemories={openAddMemory}
        onScrollToTrends={scrollToTrends}
        onOpenAlerts={() => showToast('Alerts: 1 pending amber alert. No agitation events in the last 30 days.')}
      />

      <AddMemoryModal
        key={`memory-${memoryModalSession}`}
        isOpen={isAddMemoryOpen || Boolean(editingMemory)}
        editingMemory={editingMemory}
        familyMembers={familyMembers}
        onClose={() => {
          setIsAddMemoryOpen(false);
          setEditingMemory(null);
        }}
        patientName={data.patient.name}
        onSubmitMemory={async (payload) => {
          const { memory } = editingMemory
            ? await caregiverApi.updateMemory(token, editingMemory.id, payload)
            : await caregiverApi.createMemory(token, payload);
          // Re-fetch rather than locally splicing the row in — the
          // dashboard endpoint is the single source of truth for
          // `memories`/`familyMembers` (it reads the same tables), so this
          // keeps them from drifting (e.g. a new person created inline here
          // needs to show up in the People panel and the next memory's
          // dropdown too).
          await loadDashboard();
          showToast(
            editingMemory
              ? 'Memory updated and synced to the tablet!'
              : `Memory saved and synced to ${data.patient.name}'s tablet!`,
          );
          return memory;
        }}
      />

      <FamilyMemberModal
        key={`person-${personModalSession}`}
        isOpen={isAddPersonOpen || Boolean(editingPerson)}
        editingMember={editingPerson}
        onClose={() => {
          setIsAddPersonOpen(false);
          setEditingPerson(null);
        }}
        onSubmit={async (payload) => {
          const { familyMember } = editingPerson
            ? await caregiverApi.updateFamilyMember(token, editingPerson.id, payload)
            : await caregiverApi.createFamilyMember(token, payload);
          await loadDashboard();
          showToast(editingPerson ? `${familyMember.name} updated.` : `${familyMember.name} added.`);
          return familyMember;
        }}
      />

      <RoutineItemModal
        key={`routine-${routineModalSession}`}
        isOpen={isAddRoutineOpen || Boolean(editingRoutine)}
        editingItem={editingRoutine}
        onClose={() => {
          setIsAddRoutineOpen(false);
          setEditingRoutine(null);
        }}
        onSubmit={async (payload) => {
          const { routine } = editingRoutine
            ? await caregiverApi.updateRoutine(token, editingRoutine.id, payload)
            : await caregiverApi.createRoutine(token, payload);
          await loadDashboard();
          showToast(editingRoutine ? 'Routine item updated.' : 'Routine item added.');
          return routine;
        }}
      />

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title={pendingDelete?.title}
        message={pendingDelete?.message}
        confirmLabel="Delete"
        isDangerous
        isSubmitting={isDeleting}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <Toast message={toastMessage} />
    </div>
  );
}
