import { createContext, useCallback, useMemo, useState } from 'react';
import { translate, DEFAULT_LANGUAGE } from '../i18n';
import { LANGUAGES } from '../utils/constants';

export const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);

  const changeLanguage = useCallback((code) => {
    const supported = LANGUAGES.some((entry) => entry.code === code);
    setLanguage(supported ? code : DEFAULT_LANGUAGE);
  }, []);

  const t = useCallback((key, vars) => translate(language, key, vars), [language]);

  const value = useMemo(
    () => ({
      language,
      changeLanguage,
      t,
      languages: LANGUAGES,
    }),
    [language, changeLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
