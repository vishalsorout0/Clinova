import { User, IdCard } from 'lucide-react';
import { initialsFromName } from '../../utils/formatters';

export default function PatientDetails({ patient }) {
  if (!patient) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 font-heading text-xl font-semibold text-teal-700">
          {initialsFromName(patient.name) || <User className="h-6 w-6" />}
        </span>
        <div>
          <h2 className="font-heading text-xl font-semibold text-ink-800">{patient.name}</h2>
          <p className="text-sm text-ink-500">
            {patient.age} yrs · {patient.gender}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-full bg-ink-50 px-4 py-2 text-xs font-medium text-ink-500">
        <IdCard className="h-3.5 w-3.5" aria-hidden="true" />
        {patient.abhaAddress}
      </div>
      {patient.chiefComplaint && (
        <div className="w-full rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-800">
          <span className="font-semibold">Chief complaint: </span>
          {patient.chiefComplaint}
        </div>
      )}
    </div>
  );
}
