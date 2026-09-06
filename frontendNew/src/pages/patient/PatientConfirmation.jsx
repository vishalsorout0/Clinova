import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PatientConfirmationCard from '../../components/patient/PatientConfirmation';
import Loader from '../../components/common/Loader';
import { getClinicalSummary } from '../../services/summaryService';
import * as summaryService from '../../services/summaryService';
import { useLanguage } from '../../hooks/useLanguage';
import { ROUTES } from '../../utils/constants';
import { pageTransition } from '../../utils/helpers';

export default function PatientConfirmationPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    getClinicalSummary().then(setSummary);
  }, []);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await summaryService.confirmSummary('pat_001', summary);
      setIsConfirmed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!summary) return <Loader fullScreen label={t('common.loading')} />;

  return (
    <motion.div {...pageTransition} className="mx-auto w-full max-w-2xl flex-1 py-6">
      <PatientConfirmationCard
        summary={summary}
        isSubmitting={isSubmitting}
        isConfirmed={isConfirmed}
        onConfirm={handleConfirm}
        onEdit={() => navigate(ROUTES.PATIENT_SUMMARY)}
      />
    </motion.div>
  );
}
