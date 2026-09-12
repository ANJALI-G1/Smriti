import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/client.js';

const STORAGE_KEY = 'smriti.auth';
const AuthContext = createContext(null);

function decodeJwtPayload(token) {
  try {
    const [, payload] = token.split('.');
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

function loadStoredSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { token } = JSON.parse(raw);
    const payload = decodeJwtPayload(token);
    if (!payload || payload.exp * 1000 < Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return { token, user: { id: payload.id, username: payload.username, role: payload.role, displayName: payload.displayName } };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSession(loadStoredSession());
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    const { token, user } = await authApi.login(username, password);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token }));
    setSession({ token, user });
    return user;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  };

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session),
      isLoading,
      login,
      logout,
    }),
    [session, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
