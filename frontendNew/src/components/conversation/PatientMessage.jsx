import { motion } from 'framer-motion';
import { fadeInUp } from '../../utils/helpers';

export default function PatientMessage({ text }) {
  return (
    <motion.div {...fadeInUp} className="flex items-start justify-end gap-3">
      <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-teal-600 px-4 py-3 text-white shadow-card">
        <p className="text-base">{text}</p>
      </div>
    </motion.div>
  );
}
