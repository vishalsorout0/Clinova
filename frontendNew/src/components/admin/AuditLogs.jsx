import { useEffect, useState } from 'react';
import { ScrollText } from 'lucide-react';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import { getAuditLogs } from '../../services/adminService';

export default function AuditLogs() {
  const [logs, setLogs] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setError(null);
    setLogs(null);
    try {
      setLogs(await getAuditLogs());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (!logs) return <Loader label="Loading audit logs…" />;

  return (
    <ul className="flex flex-col divide-y divide-ink-100 rounded-2xl border border-ink-100 bg-white shadow-card">
      {logs.map((log) => (
        <li key={log.id} className="flex items-start gap-3 px-5 py-4">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500">
            <ScrollText className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="flex-1 text-sm">
            <p className="text-ink-800">
              <span className="font-semibold">{log.actor}</span> {log.action.toLowerCase()} —{' '}
              <span className="text-ink-600">{log.target}</span>
            </p>
            <p className="text-xs text-ink-400">{log.time}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
