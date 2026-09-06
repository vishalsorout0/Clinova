import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Stethoscope, Bell, LogOut, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';
import { classNames } from '../utils/helpers';

export default function PhysicianLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.PHYSICIAN_LOGIN);
  };

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="border-b border-ink-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-800 text-white">
              <Stethoscope className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-heading text-lg font-semibold text-ink-800">Doctor Dashboard</p>
              {user?.name && <p className="text-xs text-ink-500">{user.name}</p>}
            </div>
          </div>

          <nav className="flex items-center gap-1 rounded-full bg-ink-50 p-1">
            <NavLink
              to={ROUTES.PHYSICIAN_DASHBOARD}
              className={({ isActive }) =>
                classNames(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium',
                  isActive ? 'bg-white shadow-card text-teal-700' : 'text-ink-500'
                )
              }
            >
              <Users className="h-4 w-4" aria-hidden="true" />
              Today&rsquo;s queue
            </NavLink>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-ink-500"
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              Notifications
            </button>
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-600 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
