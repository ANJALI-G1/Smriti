import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CaregiverDashboardPage from './pages/CaregiverDashboardPage.jsx';
import PatientPage from './pages/PatientPage.jsx';
import PatientMemoriesPage from './pages/PatientMemoriesPage.jsx';
import PatientActivitiesPage from './pages/PatientActivitiesPage.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/caregiver"
        element={
          <ProtectedRoute role="caregiver">
            <CaregiverDashboardPage />
          </ProtectedRoute>
        }
      />
      {/* /patient and its sub-pages are intentionally NOT wrapped in
          ProtectedRoute: the patient UI renders immediately and
          unauthenticated access is handled by an in-page login modal
          overlay, not a redirect — see PatientAppShell.jsx. */}
      <Route path="/patient" element={<PatientPage />} />
      <Route path="/patient/memories" element={<PatientMemoriesPage />} />
      <Route path="/patient/activities" element={<PatientActivitiesPage />} />
    </Routes>
  );
}

export default App;
