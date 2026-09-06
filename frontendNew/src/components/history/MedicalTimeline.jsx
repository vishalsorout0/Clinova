import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Pill, Scan, Inbox } from 'lucide-react';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import { getMedicalTimeline } from '../../services/documentService';
import { useLanguage } from '../../hooks/useLanguage';
import { formatDate } from '../../utils/formatters';
import { groupByMonth as groupHelper, staggerContainer, fadeInUp } from '../../utils/helpers';

const TYPE_ICON = {
  'Lab Report': FileText,
  Prescription: Pill,
  Imaging: Scan,
};

export default function MedicalTimeline({ patientId, onSelectEntry }) {
  const { t } = useLanguage();
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setError(null);
    setEntries(null);
    try {
      const data = await getMedicalTimeline(patientId);
      setEntries(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (!entries) return <Loader label={t('common.loading')} />;

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-ink-200 py-10 text-center text-ink-500">
        <Inbox className="h-8 w-8" aria-hidden="true" />
        <p>{t('timeline.empty')}</p>
      </div>
    );
  }

  const grouped = groupHelper(entries, 'date');

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="flex flex-col gap-8">
      {Object.entries(grouped).map(([month, items]) => (
        <div key={month}>
          <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wide text-ink-400">{month}</h3>
          <ol className="relative ml-3 flex flex-col gap-6 border-l-2 border-teal-100 pl-6">
            {items.map((item) => {
              const Icon = TYPE_ICON[item.type] || FileText;
              return (
                <motion.li key={item.id} variants={fadeInUp} className="relative">
                  <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white ring-4 ring-white">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectEntry?.(item)}
                    className="kiosk-touch-target w-full rounded-xl border border-ink-100 bg-white px-4 py-3 text-left shadow-card hover:border-teal-200"
                  >
                    <p className="font-medium text-ink-800">{item.title}</p>
                    <p className="text-xs text-ink-500">
                      {item.type} · {formatDate(item.date)}
                    </p>
                  </button>
                </motion.li>
              );
            })}
          </ol>
        </div>
      ))}
    </motion.div>
  );
}
