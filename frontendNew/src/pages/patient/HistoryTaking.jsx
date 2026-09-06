import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ChatWindow from '../../components/conversation/ChatWindow';
import EmergencyAlert from '../../components/emergency/EmergencyAlert';
import ClinicalHistory from '../../components/history/ClinicalHistory';
import Button from '../../components/common/Button';
import { PatientContext } from '../../context/PatientContext';
import { useLanguage } from '../../hooks/useLanguage';
import { ROUTES } from '../../utils/constants';
import { pageTransition } from '../../utils/helpers';

export default function HistoryTaking() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { structuredHistory, setStructuredHistory, markStepStatus } = useContext(PatientContext);
  const [isRedFlagged, setIsRedFlagged] = useState(false);

  const handleComplete = (history) => {
    setStructuredHistory(history);
    markStepStatus('healthHistory', 'done');
  };

  if (isRedFlagged) {
    return (
      <motion.div {...pageTransition} className="flex flex-1 items-center justify-center py-8">
        <EmergencyAlert onContactStaff={() => {}} />
      </motion.div>
    );
  }

  if (structuredHistory) {
    return (
      <motion.div {...pageTransition} className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 py-6">
        <h1 className="font-heading text-2xl font-semibold text-ink-800">{t('history.heading')}</h1>
        <ClinicalHistory history={structuredHistory} onUpdate={setStructuredHistory} />
        <Button size="lg" onClick={() => navigate(ROUTES.PATIENT_DOCUMENTS)}>
          {t('common.continue')}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div {...pageTransition} className="mx-auto w-full max-w-2xl flex-1 py-6">
      <ChatWindow onRedFlag={() => setIsRedFlagged(true)} onComplete={handleComplete} />
    </motion.div>
  );
}
