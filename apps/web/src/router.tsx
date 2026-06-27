import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { ForgotPasswordPage } from '@/features/auth/pages/forgot-password';
import { HomePage } from '@/features/auth/pages/home';
import { LoginCallbackPage } from '@/features/auth/pages/login-callback';
import { LoginPage } from '@/features/auth/pages/login';
import { ResetPasswordPage } from '@/features/auth/pages/reset-password';
import { HubPage } from '@/features/hub/pages/hub';

const rootRoute = createRootRoute({ component: () => <Outlet /> });

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage });

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  validateSearch: (raw) => raw as { error?: string; return_to?: string },
  component: LoginPage,
});

const loginCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login/callback',
  validateSearch: (raw) => raw as { error?: string; return_to?: string },
  component: LoginCallbackPage,
});

const forgotPasswordRoute = createRoute({ getParentRoute: () => rootRoute, path: '/forgot-password', component: ForgotPasswordPage });
const resetPasswordRoute = createRoute({ getParentRoute: () => rootRoute, path: '/reset-password', validateSearch: (raw) => raw as { token?: string; error?: string }, component: ResetPasswordPage });
const hubRoute = createRoute({ getParentRoute: () => rootRoute, path: '/hub', component: HubPage });

const routeTree = rootRoute.addChildren([
  indexRoute, loginRoute, loginCallbackRoute, forgotPasswordRoute, resetPasswordRoute, hubRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register { router: typeof router; }
}
