import { useEffect, useMemo, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Clock } from 'lucide-react';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { formatDuration } from '../utils/formatters';
import { ROUTES, SESSION_TIMEOUT_SECONDS, SESSION_TIMEOUT_WARNING_SECONDS } from '../utils/constants';

const LOGIN_ROUTE_BY_ROLE = {
  patient: ROUTES.PATIENT_LOGIN,
  physician: ROUTES.PHYSICIAN_LOGIN,
  admin: ROUTES.ADMIN_LOGIN,
};

export default function ProtectedRoute() {
  const { isAuthenticated, role, lastActivityAt, recordActivity, logout } = useAuth();
  const { t } = useLanguage();
  const [remaining, setRemaining] = useState(SESSION_TIMEOUT_SECONDS);

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastActivityAt) / 1000);
      setRemaining(Math.max(SESSION_TIMEOUT_SECONDS - elapsed, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated, lastActivityAt]);

  const showWarning = useMemo(
    () => isAuthenticated && remaining > 0 && remaining <= SESSION_TIMEOUT_WARNING_SECONDS,
    [isAuthenticated, remaining]
  );

  useEffect(() => {
    if (isAuthenticated && remaining === 0) {
      logout();
    }
  }, [isAuthenticated, remaining, logout]);

  if (!isAuthenticated) {
    return <Navigate to={LOGIN_ROUTE_BY_ROLE[role] || ROUTES.WELCOME} replace />;
  }

  return (
    <>
      <Outlet />
      <Modal isOpen={showWarning} onClose={recordActivity} title={t('auth.sessionExpiring')} size="sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <Clock className="h-10 w-10 text-amber-600" aria-hidden="true" />
          <p className="text-ink-600">{t('auth.sessionExpiringBody')}</p>
          <p className="font-heading text-3xl font-bold text-ink-800">{formatDuration(remaining)}</p>
          <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-center">
            <Button variant="ghost" onClick={logout}>
              {t('auth.logout')}
            </Button>
            <Button onClick={recordActivity}>{t('auth.continueSession')}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
