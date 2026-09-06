import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import { useDocument } from '../../hooks/useDocument';
import { useLanguage } from '../../hooks/useLanguage';
import { fadeInUp } from '../../utils/helpers';

const STAGE_LABEL_KEYS = {
  uploading: 'documents.uploading',
  reading: 'documents.reading',
  extracting: 'documents.extracting',
  checking: 'documents.checking',
  completed: 'documents.completed',
};

export default function DocumentUpload({ onProcessed }) {
  const { t } = useLanguage();
  const { stage, STAGES, uploadProgress, ocrResult, error, processFile, reset } = useDocument();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = useCallback(
    async (fileList) => {
      const file = fileList?.[0];
      if (!file) return;
      const result = await processFile(file);
      if (result) onProcessed?.(result);
    },
    [processFile, onProcessed]
  );

  const isBusy = ![STAGES.IDLE, STAGES.ERROR, STAGES.COMPLETED].includes(stage);

  return (
    <div className="flex flex-col gap-4">
      {(stage === STAGES.IDLE || stage === STAGES.ERROR) && (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            handleFiles(event.dataTransfer.files);
          }}
          className={`flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
            isDragging ? 'border-teal-500 bg-teal-50' : 'border-ink-200 bg-white'
          }`}
        >
          <UploadCloud className="h-12 w-12 text-teal-500" aria-hidden="true" />
          <div>
            <p className="font-heading text-lg font-semibold text-ink-800">{t('documents.dragDrop')}</p>
            <p className="text-sm text-ink-500">
              {t('documents.orText')} · {t('documents.supported')}
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,image/jpeg,image/jpg,image/png"
            className="sr-only"
            onChange={(event) => handleFiles(event.target.files)}
          />
          <Button icon={FileText} onClick={() => inputRef.current?.click()}>
            {t('documents.chooseFile')}
          </Button>
        </div>
      )}

      {error && stage === STAGES.ERROR && <ErrorMessage message={error} onRetry={reset} />}

      <AnimatePresence>
        {isBusy && (
          <motion.div
            {...fadeInUp}
            className="flex flex-col items-center gap-4 rounded-2xl border border-ink-100 bg-white px-6 py-10 text-center shadow-card"
          >
            <Loader2 className="h-10 w-10 animate-spin text-teal-600" aria-hidden="true" />
            <p className="font-medium text-ink-700">{t(STAGE_LABEL_KEYS[stage] || 'documents.uploading')}</p>
            {stage === STAGES.UPLOADING && (
              <div className="h-2 w-56 overflow-hidden rounded-full bg-ink-100">
                <motion.div
                  className="h-full rounded-full bg-teal-600"
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            )}
            <ol className="flex gap-2 text-xs text-ink-400" aria-hidden="true">
              {['reading', 'extracting', 'checking'].map((step) => (
                <li
                  key={step}
                  className={
                    stage === step || (stage === STAGES.COMPLETED && step === 'checking')
                      ? 'font-semibold text-teal-600'
                      : ''
                  }
                >
                  {t(STAGE_LABEL_KEYS[step])}
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>

      {stage === STAGES.COMPLETED && ocrResult && (
        <motion.div
          {...fadeInUp}
          className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4"
        >
          <CheckCircle2 className="h-6 w-6 text-green-600" aria-hidden="true" />
          <p className="text-sm font-medium text-green-800">
            {ocrResult.documentName} — {t('documents.completed')}
          </p>
        </motion.div>
      )}
    </div>
  );
}
