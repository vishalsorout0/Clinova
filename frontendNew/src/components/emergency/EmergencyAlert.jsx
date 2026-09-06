import { motion } from 'framer-motion';
import { AlertOctagon, PhoneCall, HeartPulse } from 'lucide-react';
import Button from '../common/Button';
import { useLanguage } from '../../hooks/useLanguage';
import { fadeInUp } from '../../utils/helpers';

export default function EmergencyAlert({ onContactStaff }) {
  const { t } = useLanguage();

  return (
    <div
      role="alertdialog"
      aria-live="assertive"
      className="a11y-surface flex min-h-[70vh] flex-col items-center justify-center gap-6 rounded-2xl border-2 border-red-300 bg-red-50 px-8 py-12 text-center"
    >
      <motion.span
        {...fadeInUp}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-white"
      >
        <AlertOctagon className="h-10 w-10" aria-hidden="true" />
      </motion.span>

      <motion.h1 {...fadeInUp} className="font-heading text-2xl font-bold text-red-700 sm:text-3xl">
        {t('emergency.heading')}
      </motion.h1>

      <motion.p {...fadeInUp} className="max-w-md text-base text-ink-700">
        {t('emergency.body')}
      </motion.p>

      <motion.p {...fadeInUp} className="flex items-center gap-2 text-sm font-medium text-red-600">
        <HeartPulse className="h-4 w-4" aria-hidden="true" />
        {t('emergency.stayCalm')}
      </motion.p>

      <Button variant="danger" size="lg" icon={PhoneCall} onClick={onContactStaff}>
        {t('emergency.contactStaff')}
      </Button>
    </div>
  );
}
