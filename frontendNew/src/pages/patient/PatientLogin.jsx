import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ABHALogin from '../../components/patient/ABHALogin';
import { ROUTES } from '../../utils/constants';
import { pageTransition } from '../../utils/helpers';

export default function PatientLogin() {
  const navigate = useNavigate();

  return (
    <motion.div {...pageTransition} className="flex flex-1 items-center justify-center py-8">
      <ABHALogin onSuccess={() => navigate(ROUTES.PATIENT_CONSENT)} />
    </motion.div>
  );
}
