import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { caregiverApi } from '../api/client.js';
import Toast from '../components/ui/Toast.jsx';
import CaregiverHeader from '../components/caregiver/CaregiverHeader.jsx';
import PatientHero from '../components/caregiver/PatientHero.jsx';
import TodayStats from '../components/caregiver/TodayStats.jsx';
import AttentionAlert from '../components/caregiver/AttentionAlert.jsx';
import AiInsight from '../components/caregiver/AiInsight.jsx';
import RoutineTimeline from '../components/caregiver/RoutineTimeline.jsx';
import TodayActivity from '../components/caregiver/TodayActivity.jsx';
import CognitiveTrends from '../components/caregiver/CognitiveTrends.jsx';
import MemoryBank from '../components/caregiver/MemoryBank.jsx';
import OfflineProvenance from '../components/caregiver/OfflineProvenance.jsx';
import FloatingAddButton from '../components/caregiver/FloatingAddButton.jsx';
import BottomNav from '../components/caregiver/BottomNav.jsx';
import AddMemoryModal from '../components/caregiver/AddMemoryModal.jsx';

export default function CaregiverDashboardPage() {
  const { token, logout } = useAuth();

  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  // Bumped every time the modal is opened (create or edit) so it always
  // remounts with fresh state — otherwise reopening "create" repeatedly
  // would reuse the same key and keep whatever was left in the form.
  const [modalSession, setModalSession] = useState(0);
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
      const result = await caregiverApi.getDashboard(token);
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
            <RoutineTimeline items={data.routineTimeline} onShowToast={showToast} />
            <TodayActivity activity={data.todayActivity} onShowToast={showToast} />
          </div>

          <div className="lg:col-span-5 space-y-8">
            <CognitiveTrends trends={data.cognitiveTrends} />
            <MemoryBank
              memories={data.memories}
              onShowToast={showToast}
              onEdit={(memory) => {
                setEditingMemory(memory);
                setModalSession((n) => n + 1);
              }}
            />
            <OfflineProvenance deviceLedger={data.deviceLedger} />
          </div>
        </div>
      </main>

      <FloatingAddButton
        onClick={() => {
          setIsAddMemoryOpen(true);
          setModalSession((n) => n + 1);
        }}
      />
      <BottomNav
        onOpenPatients={() => showToast('Use the patient selector at the top of the page to switch patients.')}
        onOpenMemories={() => {
          setIsAddMemoryOpen(true);
          setModalSession((n) => n + 1);
        }}
        onScrollToTrends={scrollToTrends}
        onOpenAlerts={() => showToast('Alerts: 1 pending amber alert. No agitation events in the last 30 days.')}
      />

      <AddMemoryModal
        key={modalSession}
        isOpen={isAddMemoryOpen || Boolean(editingMemory)}
        editingMemory={editingMemory}
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
          // dashboard endpoint is the single source of truth for `memories`
          // (it reads the same table), so this keeps them from drifting.
          await loadDashboard();
          showToast(
            editingMemory
              ? 'Memory updated and synced to the tablet!'
              : `Memory saved and synced to ${data.patient.name}'s tablet!`,
          );
          return memory;
        }}
      />

      <Toast message={toastMessage} />
    </div>
  );
}
