import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthGuard } from '@/components/AuthGuard';
import { SessionExpiredModal } from '@/components/SessionExpiredModal';
import { ToastProvider } from '@/components/Toast';
import { ForgotPasswordPage } from '@/pages/ForgotPassword';
import { HomePage } from '@/pages/Home';
import { HubPage } from '@/pages/Hub';
import { LoginPage } from '@/pages/Login';
import { LoginCallbackPage } from '@/pages/LoginCallback';
import { ResetPasswordPage } from '@/pages/ResetPassword';

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider />
      <SessionExpiredModal />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/callback" element={<LoginCallbackPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/hub"
          element={
            <AuthGuard>
              <HubPage />
            </AuthGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
