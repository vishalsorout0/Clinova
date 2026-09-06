import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircleHeart, UploadCloud, History, FileClock, Check, Circle, MinusCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { PatientContext } from '../../context/PatientContext';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { getConsultationProgress, getPatientProfile } from '../../services/patientService';
import { ROUTES } from '../../utils/constants';
import { pageTransition, staggerContainer, fadeInUp } from '../../utils/helpers';

const STEP_LABELS = {
  patientInfo: 'Patient information',
  consent: 'Consent',
  healthHistory: 'Health history',
  documents: 'Medical documents',
  clinicalSummary: 'Clinical summary',
};

const STATUS_ICON = { done: Check, in_progress: MinusCircle, pending: Circle };
const STATUS_STYLE = {
  done: 'text-green-600',
  in_progress: 'text-amber-600',
  pending: 'text-ink-300',
};

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { progress, setProgress, setProfile } = useContext(PatientContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [progressData, profileData] = await Promise.all([getConsultationProgress(), getPatientProfile()]);
      setProgress(progressData);
      setProfile(profileData);
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <Loader fullScreen label={t('common.loading')} />;

  const actions = [
    { icon: MessageCircleHeart, label: t('dashboard.startConversation'), onClick: () => navigate(ROUTES.PATIENT_HISTORY) },
    { icon: UploadCloud, label: t('dashboard.uploadDocuments'), onClick: () => navigate(ROUTES.PATIENT_DOCUMENTS) },
    { icon: FileClock, label: t('dashboard.viewTimeline'), onClick: () => navigate(ROUTES.PATIENT_TIMELINE) },
    { icon: History, label: t('dashboard.viewPrevious'), onClick: () => navigate(ROUTES.PATIENT_SUMMARY) },
  ];

  return (
    <motion.div {...pageTransition} className="flex flex-1 flex-col gap-8 py-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-ink-800">
          {t('dashboard.welcomeBack')}
          {user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-ink-500">{t('dashboard.subheading')}</p>
      </div>

      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-4 sm:grid-cols-2">
        {actions.map((action) => (
          <motion.div key={action.label} variants={fadeInUp}>
            <Button variant="secondary" size="xl" fullWidth icon={action.icon} onClick={action.onClick} className="justify-start">
              {action.label}
            </Button>
          </motion.div>
        ))}
      </motion.div>

      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
        <h2 className="mb-4 font-heading text-lg font-semibold text-ink-800">{t('dashboard.progressHeading')}</h2>
        <ul className="flex flex-col gap-3">
          {Object.entries(STEP_LABELS).map(([key, label]) => {
            const status = progress?.[key] || 'pending';
            const Icon = STATUS_ICON[status];
            return (
              <li key={key} className="flex items-center gap-3 text-sm">
                <Icon className={`h-5 w-5 ${STATUS_STYLE[status]}`} aria-hidden="true" />
                <span className={status === 'pending' ? 'text-ink-400' : 'text-ink-700'}>{label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
}
