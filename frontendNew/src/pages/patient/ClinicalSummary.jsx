import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import Button from '../../components/common/Button';
import { PatientContext } from '../../context/PatientContext';
import { getClinicalSummary } from '../../services/summaryService';
import { useLanguage } from '../../hooks/useLanguage';
import { ROUTES } from '../../utils/constants';
import { pageTransition } from '../../utils/helpers';

function Section({ label, value }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="border-b border-ink-100 py-4 last:border-0">
      <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-ink-400">{label}</h3>
      {Array.isArray(value) ? (
        <ul className="list-inside list-disc text-ink-700">
          {value.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-ink-700">{value}</p>
      )}
    </div>
  );
}

export default function ClinicalSummary() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { markStepStatus } = useContext(PatientContext);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setError(null);
    setSummary(null);
    try {
      const data = await getClinicalSummary();
      setSummary(data);
      markStepStatus('clinicalSummary', 'done');
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (!summary) return <Loader fullScreen label={t('common.loading')} />;

  return (
    <motion.div {...pageTransition} className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 py-6">
      <h1 className="font-heading text-2xl font-semibold text-ink-800">{t('summary.heading')}</h1>

      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
        <div className="mb-4 flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          {t('summary.aiGenerated')}
        </div>
        <Section label={t('summary.chiefComplaint')} value={summary.chiefComplaint} />
        <Section label={t('summary.hpi')} value={summary.historyOfPresentIllness} />
        <Section label={t('summary.pastMedicalHistory')} value={summary.pastMedicalHistory} />
        <Section label={t('summary.currentMedications')} value={summary.currentMedications} />
        <Section label={t('summary.allergies')} value={summary.allergies} />
        <Section label={t('summary.investigations')} value={summary.investigations} />
        <Section label={t('summary.abnormalFindings')} value={summary.abnormalFindings} />
        <Section label={t('summary.notes')} value={summary.notes} />
      </div>

      <Button size="lg" onClick={() => navigate(ROUTES.PATIENT_CONFIRMATION)}>
        {t('common.continue')}
      </Button>
    </motion.div>
  );
}
