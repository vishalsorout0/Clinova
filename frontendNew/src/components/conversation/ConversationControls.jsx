import { Mic, Keyboard } from 'lucide-react';
import TextToSpeech from '../accessibility/TextToSpeech';
import { useLanguage } from '../../hooks/useLanguage';
import { classNames } from '../../utils/helpers';

export default function ConversationControls({ mode, onModeChange, questionText }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-4">
      <div className="flex items-center gap-2 rounded-full bg-ink-100 p-1">
        <button
          type="button"
          onClick={() => onModeChange('voice')}
          aria-pressed={mode === 'voice'}
          className={classNames(
            'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
            mode === 'voice' ? 'bg-white text-teal-700 shadow-card' : 'text-ink-500'
          )}
        >
          <Mic className="h-4 w-4" aria-hidden="true" />
          {t('conversation.switchToVoice')}
        </button>
        <button
          type="button"
          onClick={() => onModeChange('text')}
          aria-pressed={mode === 'text'}
          className={classNames(
            'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
            mode === 'text' ? 'bg-white text-teal-700 shadow-card' : 'text-ink-500'
          )}
        >
          <Keyboard className="h-4 w-4" aria-hidden="true" />
          {t('conversation.switchToText')}
        </button>
      </div>
      <TextToSpeech text={questionText} />
    </div>
  );
}
