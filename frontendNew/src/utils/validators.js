import { SUPPORTED_DOCUMENT_TYPES, MAX_DOCUMENT_SIZE_MB } from './constants';

/** ABHA numbers are commonly displayed as 14 digits, e.g. 12-3456-7890-1234 */
export function isValidAbhaNumber(value) {
  if (!value) return false;
  const digitsOnly = value.replace(/[^0-9]/g, '');
  return digitsOnly.length === 14;
}

/** ABHA address looks like username@abdm */
export function isValidAbhaAddress(value) {
  if (!value) return false;
  return /^[a-zA-Z0-9._-]{4,}@[a-zA-Z]{2,}$/.test(value.trim());
}

export function isValidAbhaIdentifier(value) {
  return isValidAbhaNumber(value) || isValidAbhaAddress(value);
}

export function isNonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isValidDocumentFile(file) {
  if (!file) return { valid: false, reason: 'No file selected.' };
  if (!SUPPORTED_DOCUMENT_TYPES.includes(file.type)) {
    return { valid: false, reason: 'Unsupported file type. Please use PDF, JPG or PNG.' };
  }
  const sizeMb = file.size / (1024 * 1024);
  if (sizeMb > MAX_DOCUMENT_SIZE_MB) {
    return { valid: false, reason: `File is too large. Maximum size is ${MAX_DOCUMENT_SIZE_MB}MB.` };
  }
  return { valid: true, reason: null };
}

export function isValidOtp(value) {
  return /^[0-9]{6}$/.test(value || '');
}
