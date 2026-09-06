import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut, HeartPulse } from 'lucide-react';
import LanguageSelector from '../components/accessibility/LanguageSelector';
import AccessibilityControls from '../components/accessibility/AccessibilityControls';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { ROUTES } from '../utils/constants';

export default function PatientLayout() {
  const { isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.WELCOME);
  };

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white">
              <HeartPulse className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-heading text-lg font-semibold text-ink-800">{t('common.appName')}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <LanguageSelector variant="compact" />
            <AccessibilityControls />
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="kiosk-touch-target flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-600 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                {t('common.logout')}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
