import { useState } from 'react';
import {
  Accessibility,
  Type,
  Contrast,
  Volume2,
  Waves,
  Hand,
  RotateCcw,
} from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useAccessibility } from '../../hooks/useAccessibility';
import { useLanguage } from '../../hooks/useLanguage';
import { classNames } from '../../utils/helpers';

function ToggleRow({ icon: Icon, label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-ink-100 px-4 py-3">
      <span className="flex items-center gap-3 text-base font-medium text-ink-700">
        <Icon className="h-5 w-5 text-teal-700" aria-hidden="true" />
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className={classNames(
          'kiosk-touch-target relative h-8 w-14 rounded-full transition-colors',
          checked ? 'bg-teal-600' : 'bg-ink-200'
        )}
      >
        <span
          className={classNames(
            'absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-7' : 'translate-x-1'
          )}
        />
      </button>
    </div>
  );
}

export default function AccessibilityControls({ triggerClassName = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, setTextSize, toggleHighContrast, toggleVoiceGuidance, toggleReducedMotion, toggleSignLanguage, reset } =
    useAccessibility();
  const { t } = useLanguage();

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={t('accessibility.title')}
        className={classNames(
          'kiosk-touch-target flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-teal-50 hover:text-teal-700',
          triggerClassName
        )}
      >
        <Accessibility className="h-5 w-5" aria-hidden="true" />
        {t('accessibility.title')}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={t('accessibility.title')}
        footer={
          <Button variant="ghost" size="md" icon={RotateCcw} onClick={reset}>
            {t('accessibility.reset')}
          </Button>
        }
      >
        <p className="mb-5 text-sm text-ink-500">{t('accessibility.description')}</p>

        <div className="mb-5">
          <span className="mb-2 flex items-center gap-2 text-base font-medium text-ink-700">
            <Type className="h-5 w-5 text-teal-700" aria-hidden="true" />
            {t('accessibility.largeText')}
          </span>
          <div className="flex gap-2">
            {['base', 'lg', 'xl'].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setTextSize(size)}
                aria-pressed={settings.textSize === size}
                className={classNames(
                  'kiosk-touch-target flex-1 rounded-xl border-2 py-3 text-sm font-semibold uppercase tracking-wide',
                  settings.textSize === size
                    ? 'border-teal-600 bg-teal-50 text-teal-700'
                    : 'border-ink-200 text-ink-500'
                )}
              >
                {size === 'base' ? 'A' : size === 'lg' ? 'A+' : 'A++'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <ToggleRow
            icon={Contrast}
            label={t('accessibility.highContrast')}
            checked={settings.highContrast}
            onChange={toggleHighContrast}
          />
          <ToggleRow
            icon={Volume2}
            label={t('accessibility.voiceGuidance')}
            checked={settings.voiceGuidance}
            onChange={toggleVoiceGuidance}
          />
          <ToggleRow
            icon={Waves}
            label={t('accessibility.reducedMotion')}
            checked={settings.reducedMotion}
            onChange={toggleReducedMotion}
          />
          <ToggleRow
            icon={Hand}
            label={t('accessibility.signLanguage')}
            checked={settings.signLanguage}
            onChange={toggleSignLanguage}
          />
          {settings.signLanguage && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
              {t('accessibility.signLanguageComingSoon')}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
