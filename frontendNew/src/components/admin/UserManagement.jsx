import { useEffect, useState } from 'react';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import { getUsers } from '../../services/adminService';
import { classNames } from '../../utils/helpers';

const ROLE_STYLES = {
  physician: 'bg-teal-50 text-teal-700',
  admin: 'bg-ink-800 text-white',
  patient: 'bg-amber-50 text-amber-800',
  kiosk: 'bg-ink-100 text-ink-600',
};

export default function UserManagement() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setError(null);
    setUsers(null);
    try {
      setUsers(await getUsers());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (!users) return <Loader label="Loading users…" />;

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wide text-ink-400">
          <tr>
            <th className="px-5 py-3">Name</th>
            <th className="px-5 py-3">Role</th>
            <th className="px-5 py-3">Department</th>
            <th className="px-5 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-5 py-3 font-medium text-ink-800">{user.name}</td>
              <td className="px-5 py-3">
                <span className={classNames('rounded-full px-2.5 py-1 text-xs font-semibold capitalize', ROLE_STYLES[user.role])}>
                  {user.role}
                </span>
              </td>
              <td className="px-5 py-3 text-ink-600">{user.department}</td>
              <td className="px-5 py-3">
                <span
                  className={classNames(
                    'inline-flex items-center gap-1.5 text-xs font-medium',
                    user.status === 'active' ? 'text-green-700' : 'text-ink-400'
                  )}
                >
                  <span
                    className={classNames('h-2 w-2 rounded-full', user.status === 'active' ? 'bg-green-500' : 'bg-ink-300')}
                  />
                  {user.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
