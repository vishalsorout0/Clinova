import { createContext, useEffect, useMemo, useState } from 'react';

export const AccessibilityContext = createContext(null);

const DEFAULT_SETTINGS = {
  textSize: 'base', // base | lg | xl
  highContrast: false,
  voiceGuidance: false,
  reducedMotion: false,
  signLanguage: false,
};

export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;
    return { ...DEFAULT_SETTINGS, reducedMotion: prefersReducedMotion };
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-text-size', settings.textSize);
    root.setAttribute('data-contrast', settings.highContrast ? 'high' : 'normal');
    root.setAttribute('data-reduced-motion', String(settings.reducedMotion));
  }, [settings]);

  const api = useMemo(
    () => ({
      settings,
      setTextSize: (textSize) => setSettings((prev) => ({ ...prev, textSize })),
      toggleHighContrast: () =>
        setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast })),
      toggleVoiceGuidance: () =>
        setSettings((prev) => ({ ...prev, voiceGuidance: !prev.voiceGuidance })),
      toggleReducedMotion: () =>
        setSettings((prev) => ({ ...prev, reducedMotion: !prev.reducedMotion })),
      toggleSignLanguage: () =>
        setSettings((prev) => ({ ...prev, signLanguage: !prev.signLanguage })),
      reset: () => setSettings(DEFAULT_SETTINGS),
    }),
    [settings]
  );

  return <AccessibilityContext.Provider value={api}>{children}</AccessibilityContext.Provider>;
}
