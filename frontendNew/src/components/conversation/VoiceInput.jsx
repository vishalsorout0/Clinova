import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';
import { useLanguage } from '../../hooks/useLanguage';
import { formatDuration } from '../../utils/formatters';
import { fadeIn } from '../../utils/helpers';

const BAR_COUNT = 5;

export default function VoiceInput({ onResult, disabled = false }) {
  const { t, language } = useLanguage();
  const {
    isRecognitionSupported,
    isListening,
    transcript,
    seconds,
    speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeech({ language: language === 'hi' ? 'hi-IN' : 'en-IN' });

  useEffect(() => {
    if (!isListening && transcript) {
      onResult?.(transcript);
      resetTranscript();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  if (!isRecognitionSupported) {
    return (
      <p className="rounded-xl bg-ink-100 px-4 py-3 text-sm text-ink-500">
        Voice input isn&rsquo;t available on this browser. Please use the text box below.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <AnimatePresence mode="wait">
        {!isListening ? (
          <motion.button
            key="idle"
            {...fadeIn}
            type="button"
            disabled={disabled}
            onClick={startListening}
            aria-label={t('conversation.tapToSpeak')}
            className="kiosk-touch-target flex h-20 w-20 items-center justify-center rounded-full bg-teal-600 text-white shadow-card-hover transition-transform hover:scale-105 disabled:opacity-40"
          >
            <Mic className="h-8 w-8" aria-hidden="true" />
          </motion.button>
        ) : (
          <motion.div key="listening" {...fadeIn} className="flex flex-col items-center gap-3">
            <div className="flex items-end gap-1 h-10" aria-hidden="true">
              {Array.from({ length: BAR_COUNT }).map((_, index) => (
                <motion.span
                  key={index}
                  className="w-1.5 rounded-full bg-teal-500"
                  animate={{ height: [8, 28, 12, 32, 8] }}
                  transition={{ duration: 1, repeat: Infinity, delay: index * 0.1 }}
                />
              ))}
            </div>
            <p className="text-sm font-medium text-ink-600" role="status">
              {t('conversation.listening')} {formatDuration(seconds)}
            </p>
            {transcript && <p className="max-w-xs text-center text-sm text-ink-500">&ldquo;{transcript}&rdquo;</p>}
            <button
              type="button"
              onClick={stopListening}
              aria-label={t('conversation.stop')}
              className="kiosk-touch-target flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              <Square className="h-4 w-4" aria-hidden="true" />
              {t('conversation.stop')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {!isListening && <p className="text-sm text-ink-500">{t('conversation.tapToSpeak')}</p>}
      {speechError && <p className="text-sm text-red-600">{speechError}</p>}
    </div>
  );
}
