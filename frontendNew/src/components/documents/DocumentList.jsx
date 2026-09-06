import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, FileImage, Inbox } from 'lucide-react';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import DocumentPreview from './DocumentPreview';
import { getDocumentList } from '../../services/documentService';
import { useLanguage } from '../../hooks/useLanguage';
import { formatDate } from '../../utils/formatters';
import { staggerContainer, fadeInUp } from '../../utils/helpers';

export default function DocumentList({ patientId }) {
  const { t } = useLanguage();
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setError(null);
    setDocuments(null);
    try {
      const data = await getDocumentList(patientId);
      setDocuments(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (!documents) return <Loader label={t('common.loading')} />;

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-ink-200 py-10 text-center text-ink-500">
        <Inbox className="h-8 w-8" aria-hidden="true" />
        <p>{t('documents.noDocuments')}</p>
      </div>
    );
  }

  return (
    <>
      <motion.ul variants={staggerContainer} initial="initial" animate="animate" className="flex flex-col gap-3">
        {documents.map((doc) => {
          const Icon = doc.name.endsWith('.pdf') ? FileText : FileImage;
          return (
            <motion.li key={doc.id} variants={fadeInUp}>
              <button
                type="button"
                onClick={() => setSelected(doc)}
                className="kiosk-touch-target flex w-full items-center gap-4 rounded-xl border border-ink-100 bg-white px-4 py-3 text-left shadow-card hover:border-teal-200"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="flex-1">
                  <span className="block font-medium text-ink-800">{doc.name}</span>
                  <span className="block text-xs text-ink-500">
                    {doc.type} · {formatDate(doc.date)}
                  </span>
                </span>
              </button>
            </motion.li>
          );
        })}
      </motion.ul>
      <DocumentPreview document={selected} isOpen={Boolean(selected)} onClose={() => setSelected(null)} />
    </>
  );
}
