import { FileText, Calendar, Tag } from 'lucide-react';
import Modal from '../common/Modal';
import { formatDate } from '../../utils/formatters';

export default function DocumentPreview({ document, isOpen, onClose }) {
  if (!document) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={document.name} size="sm">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-40 w-full items-center justify-center rounded-2xl bg-ink-100">
          <FileText className="h-14 w-14 text-ink-400" aria-hidden="true" />
        </div>
        <dl className="w-full space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-2 text-ink-500">
              <Tag className="h-4 w-4" /> Type
            </dt>
            <dd className="font-medium text-ink-800">{document.type}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-2 text-ink-500">
              <Calendar className="h-4 w-4" /> Date
            </dt>
            <dd className="font-medium text-ink-800">{formatDate(document.date)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-ink-500">Status</dt>
            <dd className="font-medium capitalize text-teal-700">{document.status}</dd>
          </div>
        </dl>
      </div>
    </Modal>
  );
}
