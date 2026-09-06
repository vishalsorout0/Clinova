import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, QrCode, CheckCircle2, ArrowLeft } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';
import * as authService from '../../services/authService';
import { isValidAbhaIdentifier, isValidOtp } from '../../utils/validators';
import { fadeInUp } from '../../utils/helpers';

const STEP = { IDENTIFIER: 'identifier', OTP: 'otp', SUCCESS: 'success' };

export default function ABHALogin({ onSuccess }) {
  const { t } = useLanguage();
  const { login } = useAuth();

  const [step, setStep] = useState(STEP.IDENTIFIER);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [requestId, setRequestId] = useState(null);
  const [maskedMobile, setMaskedMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showQr, setShowQr] = useState(false);

  const handleRequestOtp = async (event) => {
    event.preventDefault();
    if (!isValidAbhaIdentifier(identifier)) {
      setError(t('abha.error'));
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const data = await authService.requestAbhaOtp(identifier);
      setRequestId(data.requestId);
      setMaskedMobile(data.maskedMobile);
      setStep(STEP.OTP);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    if (!isValidOtp(otp)) {
      setError('Please enter the 6-digit code.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const session = await authService.verifyAbhaOtp({ requestId, otp, identifier });
      login(session);
      setStep(STEP.SUCCESS);
      setTimeout(() => onSuccess?.(session), 900);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuest = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await authService.continueAsGuest();
      login(session);
      setStep(STEP.SUCCESS);
      setTimeout(() => onSuccess?.(session), 700);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white font-heading font-bold">
          {t('abha.title')}
        </span>
        <div>
          <h1 className="font-heading text-2xl font-semibold text-ink-800">{t('abha.heading')}</h1>
          <p className="text-sm text-ink-500">{t('abha.subheading')}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === STEP.IDENTIFIER && !showQr && (
          <motion.form key="identifier" {...fadeInUp} onSubmit={handleRequestOtp} className="flex flex-col gap-4">
            <Input
              label={t('abha.numberLabel')}
              placeholder={t('abha.numberPlaceholder')}
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              autoComplete="off"
            />
            {error && <ErrorMessage message={error} />}
            <Button type="submit" fullWidth isLoading={isLoading}>
              {t('abha.continue')}
            </Button>

            <div className="my-1 flex items-center gap-3 text-xs font-semibold uppercase text-ink-400">
              <span className="h-px flex-1 bg-ink-200" />
              {t('abha.or')}
              <span className="h-px flex-1 bg-ink-200" />
            </div>

            <Button type="button" variant="secondary" fullWidth icon={QrCode} onClick={() => setShowQr(true)}>
              {t('abha.scanQr')}
            </Button>

            <button
              type="button"
              onClick={handleGuest}
              className="mt-2 text-sm font-medium text-teal-700 underline-offset-2 hover:underline"
            >
              {t('abha.noAbha')}
            </button>

            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-ink-400">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              {t('abha.secureSession')}
            </p>
          </motion.form>
        )}

        {step === STEP.IDENTIFIER && showQr && (
          <motion.div key="qr" {...fadeInUp} className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-56 w-56 items-center justify-center rounded-2xl border-2 border-dashed border-teal-300 bg-teal-50">
              <QrCode className="h-24 w-24 text-teal-500" aria-hidden="true" />
            </div>
            <p className="text-sm text-ink-500">{t('abha.scanQrHint')}</p>
            <Button variant="ghost" icon={ArrowLeft} onClick={() => setShowQr(false)}>
              {t('common.back')}
            </Button>
          </motion.div>
        )}

        {step === STEP.OTP && (
          <motion.form key="otp" {...fadeInUp} onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <p className="text-sm text-ink-600">
              {t('abha.otpHeading')} {maskedMobile}
            </p>
            <Input
              label="OTP"
              placeholder="••••••"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))}
              helperText={t('abha.otpHint')}
            />
            {isLoading && <p className="text-sm text-teal-700">{t('abha.verifying')}</p>}
            {error && <ErrorMessage message={error} />}
            <Button type="submit" fullWidth isLoading={isLoading}>
              {t('abha.continue')}
            </Button>
            <Button type="button" variant="ghost" icon={ArrowLeft} onClick={() => setStep(STEP.IDENTIFIER)}>
              {t('common.back')}
            </Button>
          </motion.form>
        )}

        {step === STEP.SUCCESS && (
          <motion.div key="success" {...fadeInUp} className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="h-14 w-14 text-green-600" aria-hidden="true" />
            <p className="font-heading text-lg font-semibold text-ink-800">{t('abha.success')}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
