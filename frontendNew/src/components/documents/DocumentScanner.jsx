import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScanLine, Camera, CheckCircle2 } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useLanguage } from '../../hooks/useLanguage';
import { fadeIn } from '../../utils/helpers';

/**
 * Camera/scanner functionality is represented here as a polished, functional
 * placeholder. On real kiosk hardware this component's capture handler wires
 * directly into the device camera API.
 */
export default function DocumentScanner({ isOpen, onClose, onCaptured }) {
  const { t } = useLanguage();
  const [isCapturing, setIsCapturing] = useState(false);
  const [captured, setCaptured] = useState(false);

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setCaptured(true);
      setTimeout(() => {
        onCaptured?.({ id: `scan_${Date.now()}`, name: 'Scanned_Document.jpg' });
        setCaptured(false);
        onClose?.();
      }, 800);
    }, 1200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('documents.scannerTitle')} size="sm">
      <p className="mb-4 text-sm text-ink-500">{t('documents.scannerHint')}</p>
      <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-2xl bg-ink-800">
        <ScanLine className="h-16 w-16 text-teal-300" aria-hidden="true" />
        {isCapturing && (
          <motion.div
            className="absolute inset-x-0 h-1 bg-teal-400"
            initial={{ top: '10%' }}
            animate={{ top: ['10%', '90%', '10%'] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        {captured && (
          <motion.div {...fadeIn} className="absolute inset-0 flex items-center justify-center bg-ink-900/70">
            <CheckCircle2 className="h-14 w-14 text-green-400" aria-hidden="true" />
          </motion.div>
        )}
      </div>
      <Button className="mt-5" fullWidth icon={Camera} onClick={handleCapture} isLoading={isCapturing} disabled={captured}>
        {t('documents.capture')}
      </Button>
    </Modal>
  );
}
