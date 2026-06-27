import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import { queryClient } from './shared/api/query-client';
import { ErrorBoundary } from './shared/components/error-boundary';
import { ToastProvider } from './shared/components/toast';
import { SessionExpiredModal } from './shared/components/session-expired-modal';
import './shared/i18n';
import './styles/globals.css';

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ToastProvider />
          <SessionExpiredModal />
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ErrorBoundary>
    </React.StrictMode>,
  );
}
