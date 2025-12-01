import React from 'react';
import { Outlet } from 'react-router-dom';

// import { Toaster } from "../components/sonner";

import './globals.css';

export const ThemeProvider = ({
  children,
}: {
  children?: React.ReactNode | React.ReactNode[] | React.ReactElement;
}) => {
  return (
    <>
      {children || <Outlet />}

      {/* <Toaster /> */}
    </>
  );
};
