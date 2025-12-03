import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import { PrivateRoute } from './routes.private';

import { DefaultProviders } from '@/providers/defaultProviders';
import { PageLoading } from '@/shared/components/PageLoading';
import NotFoundPage from '@/shared/components/NotFoundPage';
import { PageError } from '@/shared/components/PageError';

const LandingPage = lazy(() => import('../modules/home'));
const SignInPage = lazy(() => import('../modules/auth/sign-in'));
const Dashboard = lazy(() => import('../modules/dashboard'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<DefaultProviders />}>
      <Route path="/" element={<LandingPage />} errorElement={<PageError />} />

      <Route
        path="/sign-in"
        element={<SignInPage />}
        errorElement={<PageError />}
      />

      <Route element={<PrivateRoute />}>
        <Route
          path="/dashboard"
          element={<Dashboard />}
          errorElement={<PageError />}
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
