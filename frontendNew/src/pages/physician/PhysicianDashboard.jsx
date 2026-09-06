import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { getPatientQueue } from '../../services/physicianService';
import { ROUTES } from '../../utils/constants';
import { classNames } from '../../utils/helpers';
import { pageTransition, staggerContainer, fadeInUp } from '../../utils/helpers';

export default function PhysicianDashboard() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setError(null);
    setQueue(null);
    try {
      setQueue(await getPatientQueue());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (!queue) return <Loader fullScreen label="Loading queue…" />;

  return (
    <motion.div {...pageTransition} className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold text-ink-800">Today&rsquo;s queue</h1>

      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="flex flex-col gap-3">
        {queue.map((patient) => (
          <motion.button
            key={patient.id}
            variants={fadeInUp}
            type="button"
            onClick={() => navigate(ROUTES.PHYSICIAN_PATIENT.replace(':id', patient.id))}
            className={classNames(
              'flex items-center justify-between gap-4 rounded-2xl border bg-white p-5 text-left shadow-card transition-colors hover:border-teal-300',
              patient.priority === 'urgent' ? 'border-red-200' : 'border-ink-100'
            )}
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg font-semibold text-ink-800">{patient.name}</h3>
                {patient.priority === 'urgent' && (
                  <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
                    <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                    Priority
                  </span>
                )}
              </div>
              <p className="text-sm text-ink-500">
                {patient.age} yrs · {patient.gender}
              </p>
              <p className="mt-1 text-sm text-ink-600">{patient.chiefComplaint}</p>
            </div>
            <div className="flex items-center gap-3 text-ink-400">
              <span className="flex items-center gap-1 text-xs">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {patient.waitingSince}
              </span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </div>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
