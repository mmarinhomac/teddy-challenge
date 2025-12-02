import { Outlet } from 'react-router-dom';

import { ThemeProvider } from '../shadcn/theme/ThemeProvider';

import CookieAccept from '@/shared/components/CookieAccept';

export const DefaultProviders = ({
  children,
}: {
  children?: React.ReactNode | React.ReactNode[] | React.ReactElement;
}) => {
  return (
    <ThemeProvider>
      {children || <Outlet />}

      <CookieAccept />
    </ThemeProvider>
  );
};
