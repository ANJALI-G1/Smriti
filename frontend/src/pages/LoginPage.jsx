import { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ApiError } from '../api/client.js';
import Button from '../components/ui/Button.jsx';

const HOME_ROUTE_BY_ROLE = {
  caregiver: '/caregiver',
  patient: '/patient',
};

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={redirectTarget || HOME_ROUTE_BY_ROLE[user.role] || '/'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const loggedInUser = await login(username, password);
      navigate(redirectTarget || HOME_ROUTE_BY_ROLE[loggedInUser.role] || '/', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-ivory px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-brand-border shadow-elevated p-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="font-editorial text-2xl font-semibold text-brand-teal">SMRITI</span>
          <p className="text-sm text-brand-slate">Sign in to continue</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-brand-charcoal mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-teal text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-brand-charcoal mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-teal text-sm"
              required
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <div className="text-xs text-brand-muted text-center pt-2 border-t border-brand-border">
          Demo accounts — caregiver: <span className="font-mono">caregiver / caregiver123</span>, patient:{' '}
          <span className="font-mono">aiton / aiton123</span>
        </div>
      </div>
    </div>
  );
}
