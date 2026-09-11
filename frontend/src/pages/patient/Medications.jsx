import MedicationCard from "../../components/patient/MedicationCard";
import Loader from "../../components/common/Loader";
import { usePatient } from "../../hooks/usePatient";

export default function Medications() {
  const {
    medications,
    loading,
  } = usePatient();

  if (loading) {
    return (
      <Loader text="Loading medications..." />
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Medications</h1>
          <p>
            Your current and previous medications.
          </p>
        </div>
      </div>

      {!medications.length ? (
        <div className="empty-state">
          No medications available.
        </div>
      ) : (
        <div className="card-grid">
          {medications.map((medication) => (
            <MedicationCard
              key={medication.id}
              medication={medication}
            />
          ))}
        </div>
      )}
    </div>
  );
}