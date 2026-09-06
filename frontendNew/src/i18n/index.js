import en from './en';
import hi from './hi';

export const translations = { en, hi };

export const DEFAULT_LANGUAGE = 'en';

function getNested(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

/**
 * Look up a translation string by dot path, e.g. t('en', 'conversation.send').
 * Falls back to English, then to the key itself, so the UI never shows blank text.
 * Supports {placeholder} interpolation via the `vars` argument.
 */
export function translate(languageCode, key, vars = {}) {
  const dict = translations[languageCode] || translations[DEFAULT_LANGUAGE];
  let value = getNested(dict, key);
  if (value === undefined) {
    value = getNested(translations[DEFAULT_LANGUAGE], key);
  }
  if (value === undefined) return key;

  if (typeof value === 'string' && Object.keys(vars).length) {
    return Object.entries(vars).reduce(
      (acc, [varKey, varValue]) => acc.replaceAll(`{${varKey}}`, String(varValue)),
      value
    );
  }
  return value;
}
