import { Link } from "react-router-dom";

import Loader from "../../components/common/Loader";
import PatientCard from "../../components/patient/PatientCard";
import SummaryCard from "../../components/patient/SummaryCard";

import { usePatient } from "../../hooks/usePatient";

export default function PatientDashboard() {
  const {
    profile,
    summaries,
    labReports,
    medications,
    documents,
    loading,
    error,
  } = usePatient();

  if (loading) {
    return (
      <Loader text="Loading your medical dashboard..." />
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Patient Dashboard</h1>
          <p>
            Your health information in one place.
          </p>
        </div>

        <Link
          to="/patient/consultation"
          className="primary-link-button"
        >
          Start Consultation
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <PatientCard profile={profile} />

      <div className="stats-grid">
        <div className="stat-card">
          <strong>
            {documents.length}
          </strong>
          <span>Documents</span>
        </div>

        <div className="stat-card">
          <strong>
            {labReports.length}
          </strong>
          <span>Lab Reports</span>
        </div>

        <div className="stat-card">
          <strong>
            {medications.length}
          </strong>
          <span>Medications</span>
        </div>

        <div className="stat-card">
          <strong>
            {summaries.length}
          </strong>
          <span>Clinical Summaries</span>
        </div>
      </div>

      <section className="dashboard-section">
        <div className="section-header">
          <h2>Latest Clinical Summary</h2>

          <Link to="/patient/summaries">
            View all
          </Link>
        </div>

        {summaries.length > 0 ? (
          <SummaryCard
            summary={summaries[0]}
          />
        ) : (
          <div className="empty-state">
            No clinical summaries yet.
          </div>
        )}
      </section>
    </div>
  );
}