import { Outlet } from 'react-router-dom';

import { ThemeProvider } from '../shadcn/theme/ThemeProvider';
import { AuthLoader, AuthProvider } from '@teddy/auth';

import CookieAccept from '@/shared/components/CookieAccept';

export const DefaultProviders = ({
  children,
}: {
  children?: React.ReactNode | React.ReactNode[] | React.ReactElement;
}) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthLoader />

        {children || <Outlet />}

        <CookieAccept />
      </AuthProvider>
    </ThemeProvider>
  );
};
