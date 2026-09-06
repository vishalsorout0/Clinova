import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Pill, FileText, Inbox } from 'lucide-react';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import { getMedications } from '../../services/documentService';
import { useLanguage } from '../../hooks/useLanguage';
import { staggerContainer, fadeInUp } from '../../utils/helpers';

export default function MedicationList({ patientId }) {
  const { t } = useLanguage();
  const [medications, setMedications] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setError(null);
    setMedications(null);
    try {
      const data = await getMedications(patientId);
      setMedications(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (!medications) return <Loader label={t('common.loading')} />;

  if (medications.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-ink-200 py-10 text-center text-ink-500">
        <Inbox className="h-8 w-8" aria-hidden="true" />
        <p>No medications recorded yet.</p>
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-4 sm:grid-cols-2">
      {medications.map((med) => (
        <motion.div key={med.id} variants={fadeInUp} className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Pill className="h-5 w-5" aria-hidden="true" />
            </span>
            <h4 className="font-heading font-semibold text-ink-800">{med.name}</h4>
          </div>
          <dl className="space-y-1.5 text-sm text-ink-600">
            <div className="flex justify-between">
              <dt className="text-ink-400">{t('medications.dosage')}</dt>
              <dd className="font-medium">{med.dosage}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-400">{t('medications.frequency')}</dt>
              <dd className="font-medium text-right">{med.frequency}</dd>
            </div>
            <div className="mt-2 flex items-center gap-1.5 border-t border-ink-100 pt-2 text-xs text-ink-400">
              <FileText className="h-3.5 w-3.5" />
              {t('medications.source')}: {med.source}
            </div>
          </dl>
        </motion.div>
      ))}
    </motion.div>
  );
}
