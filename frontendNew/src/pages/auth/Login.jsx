import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartPulse, Stethoscope, ShieldHalf, ArrowRight, Sparkles, ShieldCheck, Languages as LanguagesIcon } from 'lucide-react';
import Button from '../../components/common/Button';
import LanguageSelector from '../../components/accessibility/LanguageSelector';
import AccessibilityControls from '../../components/accessibility/AccessibilityControls';
import { useLanguage } from '../../hooks/useLanguage';
import { ROUTES } from '../../utils/constants';
import { pageTransition, fadeInUp, staggerContainer } from '../../utils/helpers';

/**
 * This is the application's Welcome / Landing screen, served at the root
 * route. It doubles as the generic auth entry point (patient / doctor /
 * admin) so the mandatory structure doesn't need a separate Welcome.jsx file.
 */
export default function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const highlights = [
    { icon: Sparkles, text: 'AI-assisted, not AI-diagnosed — your doctor always reviews everything.' },
    { icon: LanguagesIcon, text: 'Speak or type in English or Hindi, with more languages on the way.' },
    { icon: ShieldCheck, text: 'Your information is shared only with your treating physician.' },
  ];

  return (
    <motion.div {...pageTransition} className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white">
            <HeartPulse className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-heading text-lg font-semibold text-ink-800">{t('common.appName')}</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector variant="compact" />
          <AccessibilityControls />
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-4 py-10 text-center sm:px-6 sm:py-16">
        <motion.div {...fadeInUp} className="flex flex-col items-center gap-5">
          <h1 className="max-w-2xl font-heading text-3xl font-bold text-ink-800 sm:text-5xl">{t('welcome.heading')}</h1>
          <p className="max-w-xl text-lg text-ink-500">{t('welcome.subheading')}</p>
          <Button size="xl" icon={ArrowRight} iconPosition="right" onClick={() => navigate(ROUTES.PATIENT_LANGUAGE)}>
            {t('welcome.startConsultation')}
          </Button>
        </motion.div>

        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid w-full gap-4 sm:grid-cols-3">
          {highlights.map((item) => (
            <motion.div key={item.text} variants={fadeInUp} className="rounded-2xl border border-ink-100 bg-white/80 p-5 text-left shadow-card">
              <item.icon className="mb-3 h-6 w-6 text-teal-600" aria-hidden="true" />
              <p className="text-sm text-ink-600">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" icon={Stethoscope} onClick={() => navigate(ROUTES.PHYSICIAN_LOGIN)}>
            {t('welcome.doctorLogin')}
          </Button>
          <Button variant="ghost" icon={ShieldHalf} onClick={() => navigate(ROUTES.ADMIN_LOGIN)}>
            {t('welcome.adminLogin')}
          </Button>
        </div>

        <p className="max-w-md text-xs text-ink-400">{t('welcome.footerNote')}</p>
      </main>
    </motion.div>
  );
}
