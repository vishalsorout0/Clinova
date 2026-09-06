import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MedicalTimeline from '../../components/history/MedicalTimeline';
import DocumentPreview from '../../components/documents/DocumentPreview';
import Button from '../../components/common/Button';
import { useLanguage } from '../../hooks/useLanguage';
import { ROUTES } from '../../utils/constants';
import { pageTransition } from '../../utils/helpers';

export default function MedicalTimelinePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selected, setSelected] = useState(null);

  return (
    <motion.div {...pageTransition} className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 py-6">
      <h1 className="font-heading text-2xl font-semibold text-ink-800">{t('timeline.heading')}</h1>
      <MedicalTimeline
        onSelectEntry={(entry) => setSelected({ name: entry.title, type: entry.type, date: entry.date, status: 'processed' })}
      />
      <Button size="lg" onClick={() => navigate(ROUTES.PATIENT_SUMMARY)}>
        {t('common.continue')}
      </Button>
      <DocumentPreview document={selected} isOpen={Boolean(selected)} onClose={() => setSelected(null)} />
    </motion.div>
  );
}
