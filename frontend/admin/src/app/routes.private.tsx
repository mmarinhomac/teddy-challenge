import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { debounceTimeout } from '@teddy/utils/time';

import { useAuth } from '@teddy/auth';
import { Logo } from '@/shared/components/Logo';

export const PrivateRoute = () => {
  const { state } = useAuth();

  const redirectToSignIn = () => {
    window.location.href = '/sign-in';
  };

  useEffect(() => {
    if (!state?.user && !state?.loading) {
      debounceTimeout(
        'redirect-to-sign-in',
        redirectToSignIn,
        500,
        'teddyAdminLayer'
      );
    }
  }, [state]);

  if (state?.loading || !state?.user) {
    return (
      <div className="w-full h-full fixed top-0 left-0 right-0 bottom-0 z-1200 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center justify-center gap-2 animate-pulse delay-500">
          <Logo />

          <span className="text-gray-500 text-sm">Autenticando...</span>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
