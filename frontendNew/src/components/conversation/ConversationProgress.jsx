import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';

export default function ConversationProgress({ progress = 0, currentIndex = 0, totalQuestions = 0 }) {
  const { t } = useLanguage();

  return (
    <div className="mb-2">
      <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-ink-500">
        <span>{t('conversation.progress', { current: Math.min(currentIndex + 1, totalQuestions || 1), total: totalQuestions || 1 })}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <motion.div
          className="h-full rounded-full bg-teal-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
