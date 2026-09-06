import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useAccessibility } from '../../hooks/useAccessibility';
import { useLanguage } from '../../hooks/useLanguage';
import { useSpeech } from '../../hooks/useSpeech';
import { fadeIn } from '../../utils/helpers';

/**
 * Drop this on any screen with a short description of what the screen does.
 * When "Voice guidance" is enabled in AccessibilityContext, it reads the
 * message aloud once when the screen appears.
 */
export default function VoiceGuide({ message }) {
  const { settings } = useAccessibility();
  const { language } = useLanguage();
  const { isSynthesisSupported, speak } = useSpeech({ language: language === 'hi' ? 'hi-IN' : 'en-IN' });
  const lastSpokenRef = useRef('');

  useEffect(() => {
    if (settings.voiceGuidance && isSynthesisSupported && message && lastSpokenRef.current !== message) {
      speak(message);
      lastSpokenRef.current = message;
    }
  }, [settings.voiceGuidance, isSynthesisSupported, message, speak]);

  return (
    <AnimatePresence>
      {settings.voiceGuidance && (
        <motion.div
          {...fadeIn}
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-teal-700 px-4 py-2 text-sm font-medium text-white shadow-card-hover"
        >
          <Volume2 className="h-4 w-4 animate-pulseSoft" aria-hidden="true" />
          Voice guidance on
        </motion.div>
      )}
    </AnimatePresence>
  );
}
