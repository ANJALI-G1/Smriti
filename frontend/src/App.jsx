import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CaregiverDashboardPage from './pages/CaregiverDashboardPage.jsx';
import PatientPage from './pages/PatientPage.jsx';
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
      {/* /patient is intentionally NOT wrapped in ProtectedRoute: the patient
          UI renders immediately and unauthenticated access is handled by an
          in-page login modal overlay, not a redirect — see PatientPage.jsx. */}
      <Route path="/patient" element={<PatientPage />} />
    </Routes>
  );
}

export default App;
