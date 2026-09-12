import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const HOME_ROUTE_BY_ROLE = {
  caregiver: '/caregiver',
  patient: '/patient',
};

export default function ProtectedRoute({ role, children }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-ivory text-brand-slate text-sm">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectTarget = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectTarget)}`} replace />;
  }

  if (user.role !== role) {
    return <Navigate to={HOME_ROUTE_BY_ROLE[user.role] || '/'} replace />;
  }

  return children;
}
