import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/landing/Navbar.jsx';
import Hero from '../components/landing/Hero.jsx';
import DualGateway from '../components/landing/DualGateway.jsx';
import VisualStory from '../components/landing/VisualStory.jsx';
import ZeroPressureComparison from '../components/landing/ZeroPressureComparison.jsx';
import OfflineFirst from '../components/landing/OfflineFirst.jsx';
import CaregiverIntelligence from '../components/landing/CaregiverIntelligence.jsx';
import VoiceInteraction from '../components/landing/VoiceInteraction.jsx';
import CulturalAnchoring from '../components/landing/CulturalAnchoring.jsx';
import TwoPerspectives from '../components/landing/TwoPerspectives.jsx';
import PrivacySection from '../components/landing/PrivacySection.jsx';
import FinalCTA from '../components/landing/FinalCTA.jsx';
import Footer from '../components/landing/Footer.jsx';

export default function LandingPage() {
  const [gatewayMode, setGatewayMode] = useState('senior');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Real entry points into the authenticated apps (as opposed to the Dual
  // Gateway section's card clicks, which only drive the marketing preview
  // toggle above and don't navigate anywhere).
  const enterCaregiverApp = useCallback(() => {
    if (isAuthenticated && user?.role === 'caregiver') {
      navigate('/caregiver');
    } else {
      navigate('/login?redirect=%2Fcaregiver');
    }
  }, [isAuthenticated, user, navigate]);

  // Patient auth is a modal overlay on the /patient page itself (not a
  // redirect to /login), so entering is always just a plain navigation —
  // PatientPage decides on its own whether to show the login modal.
  const enterPatientApp = useCallback(() => navigate('/patient'), [navigate]);

  return (
    <div className="selection:bg-brand-teal/15 selection:text-brand-teal">
      <Navbar onNavigateCaregiver={enterCaregiverApp} />
      <main>
        <Hero />
        <DualGateway
          mode={gatewayMode}
          onModeChange={setGatewayMode}
          onEnterCaregiver={enterCaregiverApp}
          onEnterPatient={enterPatientApp}
        />
        <VisualStory />
        <ZeroPressureComparison />
        <OfflineFirst />
        <CaregiverIntelligence />
        <VoiceInteraction />
        <CulturalAnchoring />
        <TwoPerspectives />
        <PrivacySection />
        <FinalCTA onLaunchSenior={enterPatientApp} onRequestCaregiver={enterCaregiverApp} />
      </main>
      <Footer />
    </div>
  );
}
