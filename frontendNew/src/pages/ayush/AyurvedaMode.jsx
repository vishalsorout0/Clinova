import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import Button from '../../components/common/Button';
import { useLanguage } from '../../hooks/useLanguage';
import { pageTransition } from '../../utils/helpers';

export default function AyurvedaMode() {
  const { t } = useLanguage();

  return (
    <motion.div {...pageTransition} className="flex min-h-screen flex-col items-center justify-center gap-6 bg-teal-50 px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-600 text-white">
        <Leaf className="h-8 w-8" aria-hidden="true" />
      </span>
      <h1 className="font-heading text-3xl font-semibold text-ink-800">{t('ayush.heading')}</h1>
      <p className="max-w-md text-ink-600">{t('ayush.body')}</p>
      <Button size="lg">{t('ayush.start')}</Button>
    </motion.div>
  );
}
