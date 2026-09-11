import LabReportCard from "../../components/patient/LabReportCard";
import Loader from "../../components/common/Loader";
import { usePatient } from "../../hooks/usePatient";

export default function LabReports() {
  const {
    labReports,
    loading,
  } = usePatient();

  if (loading) {
    return (
      <Loader text="Loading lab reports..." />
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Lab Reports</h1>
          <p>
            Your laboratory test results.
          </p>
        </div>
      </div>

      {!labReports.length ? (
        <div className="empty-state">
          No lab reports available.
        </div>
      ) : (
        <div className="card-grid">
          {labReports.map((report) => (
            <LabReportCard
              key={report.id}
              report={report}
            />
          ))}
        </div>
      )}
    </div>
  );
}