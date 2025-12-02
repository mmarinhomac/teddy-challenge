import { Outlet } from 'react-router-dom';

import { ThemeProvider } from '../shadcn/theme/ThemeProvider';

export const DefaultProviders = ({
  children,
}: {
  children?: React.ReactNode | React.ReactNode[] | React.ReactElement;
}) => {
  return <ThemeProvider>{children || <Outlet />}</ThemeProvider>;
};
