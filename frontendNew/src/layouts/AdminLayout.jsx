import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.ADMIN_LOGIN);
  };

  return (
    <div className="flex min-h-screen bg-ink-50">
      <AdminSidebar />
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-ink-100 bg-white px-6 py-4">
          <p className="text-sm text-ink-500">{user?.name}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-600 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log out
          </button>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
