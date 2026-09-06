import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Activity, Stethoscope, FileCheck2, Server } from 'lucide-react';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import UserManagement from '../../components/admin/UserManagement';
import SessionManagement from '../../components/admin/SessionManagement';
import AuditLogs from '../../components/admin/AuditLogs';
import { getAdminStats } from '../../services/adminService';
import { ROUTES } from '../../utils/constants';
import { staggerContainer, fadeInUp, pageTransition } from '../../utils/helpers';

const CARDS = [
  { key: 'totalPatients', label: 'Total patients', icon: Users },
  { key: 'activeConsultations', label: 'Active consultations', icon: Activity },
  { key: 'doctors', label: 'Doctors', icon: Stethoscope },
  { key: 'documentsProcessed', label: 'Documents processed', icon: FileCheck2 },
];

/**
 * This single page component serves the dashboard overview as well as the
 * users / sessions / audit-log routes, switching on the current path. This
 * keeps us inside the mandatory two-file admin/pages structure while still
 * providing dedicated routes for each admin section.
 */
export default function AdminDashboard() {
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    setError(null);
    setStats(null);
    try {
      setStats(await getAdminStats());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (location.pathname === ROUTES.ADMIN_DASHBOARD) loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  if (location.pathname === ROUTES.ADMIN_USERS) {
    return (
      <motion.div {...pageTransition} className="flex flex-col gap-6">
        <h1 className="font-heading text-2xl font-semibold text-ink-800">User management</h1>
        <UserManagement />
      </motion.div>
    );
  }

  if (location.pathname === ROUTES.ADMIN_SESSIONS) {
    return (
      <motion.div {...pageTransition} className="flex flex-col gap-6">
        <h1 className="font-heading text-2xl font-semibold text-ink-800">Session management</h1>
        <SessionManagement />
      </motion.div>
    );
  }

  if (location.pathname === ROUTES.ADMIN_AUDIT_LOGS) {
    return (
      <motion.div {...pageTransition} className="flex flex-col gap-6">
        <h1 className="font-heading text-2xl font-semibold text-ink-800">Audit logs</h1>
        <AuditLogs />
      </motion.div>
    );
  }

  if (error) return <ErrorMessage message={error} onRetry={loadStats} />;
  if (!stats) return <Loader fullScreen label="Loading dashboard…" />;

  return (
    <motion.div {...pageTransition} className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold text-ink-800">Admin dashboard</h1>
        <span className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
          <Server className="h-3.5 w-3.5" aria-hidden="true" />
          System {stats.systemStatus}
        </span>
      </div>

      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card) => (
          <motion.div key={card.key} variants={fadeInUp} className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
            <card.icon className="mb-3 h-6 w-6 text-teal-600" aria-hidden="true" />
            <p className="font-heading text-2xl font-bold text-ink-800">{stats[card.key]?.toLocaleString?.() ?? stats[card.key]}</p>
            <p className="text-sm text-ink-500">{card.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
