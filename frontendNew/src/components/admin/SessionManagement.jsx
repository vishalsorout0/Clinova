import { useEffect, useState } from 'react';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import { getSessions } from '../../services/adminService';
import { classNames } from '../../utils/helpers';

export default function SessionManagement() {
  const [sessions, setSessions] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setError(null);
    setSessions(null);
    try {
      setSessions(await getSessions());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (!sessions) return <Loader label="Loading sessions…" />;

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wide text-ink-400">
          <tr>
            <th className="px-5 py-3">User</th>
            <th className="px-5 py-3">Role</th>
            <th className="px-5 py-3">Device</th>
            <th className="px-5 py-3">Started</th>
            <th className="px-5 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {sessions.map((session) => (
            <tr key={session.id}>
              <td className="px-5 py-3 font-medium text-ink-800">{session.user}</td>
              <td className="px-5 py-3 capitalize text-ink-600">{session.role}</td>
              <td className="px-5 py-3 text-ink-600">{session.device}</td>
              <td className="px-5 py-3 text-ink-600">{session.startedAt}</td>
              <td className="px-5 py-3">
                <span
                  className={classNames(
                    'rounded-full px-2.5 py-1 text-xs font-semibold capitalize',
                    session.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-800'
                  )}
                >
                  {session.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
