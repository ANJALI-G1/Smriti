import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { images } from '../../assets/landingImages.js';

const FRIENDLY_ERROR = "That password doesn't look right. Let's try again.";

export default function PatientLoginModal({ isOpen }) {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login('aiton', password);
      // On success, AuthContext's state updates and PatientPage re-renders
      // without this modal — no navigation needed, no error to show.
    } catch {
      // Never surface raw backend/HTTP detail to the patient — keep it simple and kind.
      setError(FRIENDLY_ERROR);
      setPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-sm" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="patient-login-title"
        className="relative w-full max-w-md bg-white rounded-3xl shadow-elevated border border-brand-border p-8 sm:p-10 text-center space-y-6"
      >
        <img
          src={images.aitonPortrait}
          alt=""
          className="w-20 h-20 rounded-full object-cover mx-auto shadow-sm ring-4 ring-white -mt-2"
        />

        <div className="space-y-2">
          <h2 id="patient-login-title" className="font-serif text-3xl text-brand-teal">
            Welcome back, Aiton
          </h2>
          <p className="font-elderly text-lg text-brand-slate">Enter your password to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="patient-password" className="sr-only">
            Password
          </label>
          <input
            id="patient-password"
            type="password"
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-center text-2xl tracking-widest px-4 py-4 rounded-2xl border-2 border-brand-border focus:outline-none focus:border-brand-teal font-elderly"
            required
          />

          {error && (
            <p role="alert" className="font-elderly text-base text-red-700 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-16 rounded-2xl bg-brand-teal text-white font-elderly text-2xl font-bold shadow-md hover:bg-brand-tealDark transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {isSubmitting ? 'Checking…' : 'Log In'}
          </button>
        </form>

        <p className="text-xs text-brand-muted font-elderly">
          Demo password: <span className="font-mono">aiton123</span>
        </p>
      </div>
    </div>
  );
}
