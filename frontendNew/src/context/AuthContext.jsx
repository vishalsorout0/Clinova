import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { getStoredSession, clearSession, logout as logoutRequest } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredSession());
  const [lastActivityAt, setLastActivityAt] = useState(Date.now());

  const login = useCallback((newSession) => {
    setSession(newSession);
    setLastActivityAt(Date.now());
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      clearSession();
      setSession(null);
    }
  }, []);

  const recordActivity = useCallback(() => setLastActivityAt(Date.now()), []);

  useEffect(() => {
    if (!session) return undefined;
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((event) => window.addEventListener(event, recordActivity));
    return () => events.forEach((event) => window.removeEventListener(event, recordActivity));
  }, [session, recordActivity]);

  const value = useMemo(
    () => ({
      session,
      role: session?.role || null,
      user: session?.user || null,
      isAuthenticated: Boolean(session),
      lastActivityAt,
      login,
      logout,
      recordActivity,
    }),
    [session, lastActivityAt, login, logout, recordActivity]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
