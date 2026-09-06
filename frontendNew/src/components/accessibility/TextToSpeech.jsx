import { Volume2, VolumeX } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';
import { useLanguage } from '../../hooks/useLanguage';
import { classNames } from '../../utils/helpers';

/** Small "read aloud" control. Renders nothing functional if TTS is unsupported, but stays visible for consistency. */
export default function TextToSpeech({ text, label, className = '' }) {
  const { language, t } = useLanguage();
  const { isSynthesisSupported, isListening: _ignored, speak, cancelSpeaking } = useSpeech({
    language: language === 'hi' ? 'hi-IN' : 'en-IN',
  });

  if (!text) return null;

  return (
    <div className={classNames('flex items-center gap-2', className)}>
      <button
        type="button"
        onClick={() => speak(text)}
        disabled={!isSynthesisSupported}
        aria-label={label || t('accessibility.textToSpeech')}
        className="kiosk-touch-target flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-600 hover:bg-teal-50 hover:text-teal-700 disabled:opacity-40"
      >
        <Volume2 className="h-4 w-4" aria-hidden="true" />
        {label || t('accessibility.textToSpeech')}
      </button>
      {isSynthesisSupported && (
        <button
          type="button"
          onClick={cancelSpeaking}
          aria-label={t('common.close')}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-400 hover:bg-ink-100"
        >
          <VolumeX className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
