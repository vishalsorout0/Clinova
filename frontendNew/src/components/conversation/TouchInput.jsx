import { useState } from 'react';
import { Send } from 'lucide-react';
import Button from '../common/Button';
import { useLanguage } from '../../hooks/useLanguage';

export default function TouchInput({ onSubmit, disabled = false, initialValue = '' }) {
  const { t } = useLanguage();
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit?.(trimmed);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <label htmlFor="conversation-text-input" className="sr-only">
        {t('conversation.typePlaceholder')}
      </label>
      <textarea
        id="conversation-text-input"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={t('conversation.typePlaceholder')}
        rows={2}
        disabled={disabled}
        className="kiosk-touch-target flex-1 resize-none rounded-2xl border border-ink-200 bg-white px-4 py-3 text-base text-ink-800 placeholder:text-ink-400 focus:outline-none focus-visible:outline-3 focus-visible:outline-teal-600"
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            handleSubmit(event);
          }
        }}
      />
      <Button type="submit" icon={Send} iconPosition="right" disabled={disabled || !value.trim()}>
        {t('conversation.send')}
      </Button>
    </form>
  );
}
