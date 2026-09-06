import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ConsentScreen from '../../components/consent/ConsentScreen';
import { PatientContext } from '../../context/PatientContext';
import { ROUTES } from '../../utils/constants';
import { pageTransition } from '../../utils/helpers';

export default function Consent() {
  const navigate = useNavigate();
  const { setConsentGiven, markStepStatus } = useContext(PatientContext);

  const handleAgree = () => {
    setConsentGiven(true);
    markStepStatus('consent', 'done');
    navigate(ROUTES.PATIENT_DASHBOARD);
  };

  const handleDecline = () => navigate(ROUTES.WELCOME);

  return (
    <motion.div {...pageTransition} className="flex flex-1 items-center justify-center py-8">
      <ConsentScreen onAgree={handleAgree} onDecline={handleDecline} />
    </motion.div>
  );
}
