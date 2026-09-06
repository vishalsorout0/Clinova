import { useCallback, useState } from 'react';
import * as documentService from '../services/documentService';
import { isValidDocumentFile } from '../utils/validators';

const STAGES = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  READING: 'reading',
  EXTRACTING: 'extracting',
  CHECKING: 'checking',
  COMPLETED: 'completed',
  ERROR: 'error',
};

export function useDocument() {
  const [stage, setStage] = useState(STAGES.IDLE);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [ocrResult, setOcrResult] = useState(null);
  const [error, setError] = useState(null);

  const reset = useCallback(() => {
    setStage(STAGES.IDLE);
    setUploadProgress(0);
    setOcrResult(null);
    setError(null);
  }, []);

  const processFile = useCallback(async (file) => {
    const validation = isValidDocumentFile(file);
    if (!validation.valid) {
      setError(validation.reason);
      setStage(STAGES.ERROR);
      return null;
    }

    setError(null);
    setStage(STAGES.UPLOADING);
    setUploadProgress(0);

    try {
      const uploaded = await documentService.uploadDocument(file, setUploadProgress);
      const result = await documentService.processDocumentOcr(uploaded.id, (nextStage) => setStage(nextStage));
      setOcrResult(result);
      setStage(STAGES.COMPLETED);
      return result;
    } catch (err) {
      setError(err.message);
      setStage(STAGES.ERROR);
      return null;
    }
  }, []);

  return { stage, STAGES, uploadProgress, ocrResult, error, processFile, reset };
}
