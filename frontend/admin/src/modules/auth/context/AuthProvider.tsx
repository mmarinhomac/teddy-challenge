import React, { createContext, useMemo, useState } from 'react';
import type { AuthContextValue, AuthState } from '../types';
import { FormProvider as RHFProvider, useForm } from 'react-hook-form';

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const methods = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
  });

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

  return (
    <RHFProvider {...methods}>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </RHFProvider>
  );
}
