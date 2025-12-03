import { createContext, useContext, useMemo, useState, ReactNode } from 'react';

import type { AuthContextValue, AuthState } from './types';

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: false,
  });

  const setLoading = (loading: boolean) => setState((s) => ({ ...s, loading }));

  const setUser = (user: AuthState['user']) =>
    setState((s) => ({ ...s, user }));

  const value = useMemo<AuthContextValue>(
    () => ({
      state,
      setLoading,
      setUser,
    }),
    [state, setLoading, setUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
