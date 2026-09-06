import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import Button from '../../components/common/Button';
import { useLanguage } from '../../hooks/useLanguage';
import { ROUTES } from '../../utils/constants';
import { pageTransition } from '../../utils/helpers';

export default function NotFound() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <motion.div {...pageTransition} className="flex min-h-screen flex-col items-center justify-center gap-5 bg-ink-50 px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-800 text-white">
        <Compass className="h-8 w-8" aria-hidden="true" />
      </span>
      <h1 className="font-heading text-2xl font-semibold text-ink-800">{t('auth.notFoundHeading')}</h1>
      <p className="max-w-sm text-ink-500">{t('auth.notFoundBody')}</p>
      <Button onClick={() => navigate(ROUTES.WELCOME)}>{t('auth.goHome')}</Button>
    </motion.div>
  );
}
