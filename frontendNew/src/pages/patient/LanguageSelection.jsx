import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LanguageSelector from '../../components/accessibility/LanguageSelector';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import { pageTransition } from '../../utils/helpers';

export default function LanguageSelection() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const goNext = () => navigate(isAuthenticated ? ROUTES.PATIENT_DASHBOARD : ROUTES.PATIENT_LOGIN);

  return (
    <motion.div {...pageTransition} className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-6 py-8">
      <div className="text-center">
        <h1 className="font-heading text-2xl font-semibold text-ink-800">{t('language.heading')}</h1>
        <p className="mt-1 text-ink-500">{t('language.subheading')}</p>
      </div>
      <LanguageSelector onSelect={goNext} />
    </motion.div>
  );
}
