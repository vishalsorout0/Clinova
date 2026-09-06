import { motion } from 'framer-motion';
import { Check, Languages } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { classNames, staggerContainer, fadeInUp } from '../../utils/helpers';

export default function LanguageSelector({ variant = 'cards', onSelect }) {
  const { language, changeLanguage, languages, t } = useLanguage();

  const handleSelect = (code) => {
    changeLanguage(code);
    onSelect?.(code);
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 rounded-full border border-ink-200 bg-white p-1">
        <Languages className="ml-2 h-4 w-4 text-ink-400" aria-hidden="true" />
        {languages.map((entry) => (
          <button
            key={entry.code}
            type="button"
            onClick={() => handleSelect(entry.code)}
            aria-pressed={language === entry.code}
            className={classNames(
              'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
              language === entry.code ? 'bg-teal-600 text-white' : 'text-ink-600 hover:bg-ink-100'
            )}
          >
            {entry.nativeLabel}
          </button>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2"
    >
      {languages.map((entry) => (
        <motion.button
          key={entry.code}
          variants={fadeInUp}
          type="button"
          onClick={() => handleSelect(entry.code)}
          aria-pressed={language === entry.code}
          className={classNames(
            'kiosk-touch-target flex items-center justify-between rounded-2xl border-2 bg-white px-6 py-6 text-left shadow-card transition-colors',
            language === entry.code ? 'border-teal-600' : 'border-transparent hover:border-teal-200'
          )}
        >
          <span>
            <span className="block font-heading text-xl font-semibold text-ink-800">{entry.nativeLabel}</span>
            <span className="block text-sm text-ink-500">{entry.label}</span>
          </span>
          {language === entry.code && (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white">
              <Check className="h-5 w-5" />
            </span>
          )}
        </motion.button>
      ))}
      <div className="sm:col-span-2 rounded-2xl border border-dashed border-ink-200 px-6 py-5 text-center text-sm text-ink-500">
        {t('language.other')} — {t('language.comingSoon')}
      </div>
    </motion.div>
  );
}
