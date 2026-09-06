import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, PencilLine } from 'lucide-react';
import Button from '../common/Button';
import { useLanguage } from '../../hooks/useLanguage';
import { fadeInUp } from '../../utils/helpers';

export default function PatientConfirmation({ summary, onConfirm, onEdit, isSubmitting = false, isConfirmed = false }) {
  const { t } = useLanguage();
  const [checked, setChecked] = useState(false);

  if (isConfirmed) {
    return (
      <motion.div {...fadeInUp} className="flex flex-col items-center gap-4 py-10 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-600" aria-hidden="true" />
        <h2 className="font-heading text-2xl font-semibold text-ink-800">{t('confirmation.ready')}</h2>
        <p className="max-w-sm text-ink-500">{t('confirmation.success')}</p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold text-ink-800">{t('confirmation.heading')}</h2>
        <p className="text-ink-500">{t('confirmation.subheading')}</p>
      </div>

      <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-wide text-ink-400">{t('summary.chiefComplaint')}</p>
        <p className="mt-1 text-ink-800">{summary?.chiefComplaint}</p>
      </div>

      <label className="flex items-start gap-3 rounded-xl bg-ink-50 px-4 py-3 text-sm text-ink-600">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
          className="mt-1 h-5 w-5 rounded border-ink-300 text-teal-600 focus-visible:outline-2 focus-visible:outline-teal-600"
        />
        I have reviewed the information above and confirm it is accurate to the best of my knowledge.
      </label>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" icon={PencilLine} onClick={onEdit}>
          {t('confirmation.editInformation')}
        </Button>
        <Button disabled={!checked} isLoading={isSubmitting} onClick={onConfirm}>
          {t('confirmation.confirm')}
        </Button>
      </div>
    </div>
  );
}
