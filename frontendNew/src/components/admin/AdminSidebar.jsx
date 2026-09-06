import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, MonitorSmartphone, ScrollText, ShieldHalf } from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import { classNames } from '../../utils/helpers';

const NAV_ITEMS = [
  { to: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.ADMIN_USERS, label: 'User management', icon: Users },
  { to: ROUTES.ADMIN_SESSIONS, label: 'Session management', icon: MonitorSmartphone },
  { to: ROUTES.ADMIN_AUDIT_LOGS, label: 'Audit logs', icon: ScrollText },
];

export default function AdminSidebar() {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col gap-1 border-r border-ink-100 bg-white p-4">
      <div className="mb-6 flex items-center gap-2 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-800 text-white">
          <ShieldHalf className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="font-heading text-lg font-semibold text-ink-800">Admin</span>
      </div>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            classNames(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              isActive ? 'bg-teal-50 text-teal-700' : 'text-ink-600 hover:bg-ink-50'
            )
          }
        >
          <item.icon className="h-4 w-4" aria-hidden="true" />
          {item.label}
        </NavLink>
      ))}
    </aside>
  );
}
