import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import { DefaultProviders } from '@/providers/defaultProviders';

const LandingPage = lazy(() => import('../modules/home'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<DefaultProviders />}>
      <Route path="/" element={<LandingPage />} />
    </Route>
  )
);

export function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
