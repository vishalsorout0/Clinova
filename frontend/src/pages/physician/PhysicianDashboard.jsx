import {
  useEffect,
  useState,
} from "react";

import {
  getMyPhysicianProfile,
  getAuthorizedPatients,
} from "../../services/physicianService";

import PatientList from "../../components/physician/PatientList";
import PatientOverview from "./PatientOverview";
import SummaryReview from "./SummaryReview";

export default function PhysicianDashboard() {
  const [
    physician,
    setPhysician,
  ] = useState(null);

  const [
    patients,
    setPatients,
  ] = useState([]);

  const [
    selectedPatient,
    setSelectedPatient,
  ] = useState(null);

  const [
    selectedSummary,
    setSelectedSummary,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);

        const [
          profile,
          authorizedPatients,
        ] = await Promise.all([
          getMyPhysicianProfile(),
          getAuthorizedPatients(),
        ]);

        setPhysician(profile);

        setPatients(
          Array.isArray(
            authorizedPatients
          )
            ? authorizedPatients
            : authorizedPatients?.patients ||
                []
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to load physician dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  function handlePatientSelect(
    patient
  ) {
    setSelectedPatient(patient);
    setSelectedSummary(null);
  }

  function handleSummarySelect(
    summary
  ) {
    setSelectedSummary(summary);
  }

  function handleBackToPatient() {
    setSelectedSummary(null);
  }

  return (
    <div className="physician-dashboard">
      <header className="physician-dashboard-header">
        <div>
          <span className="dashboard-eyebrow">
            Clinova Physician Portal
          </span>

          <h1>
            Welcome,{" "}
            {physician?.full_name ||
              "Physician"}
          </h1>

          <p>
            Review authorized patient
            clinical summaries.
          </p>
        </div>

        {physician && (
          <div className="physician-profile-mini">
            <strong>
              {physician.full_name}
            </strong>

            <span>
              {physician.specialization ||
                "Physician"}
            </span>
          </div>
        )}
      </header>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="physician-dashboard-grid">
        <PatientList
          patients={patients}
          selectedPatient={
            selectedPatient
          }
          onSelect={
            handlePatientSelect
          }
          loading={loading}
        />

        <section className="physician-content">
          {selectedSummary ? (
            <SummaryReview
              summaryId={
                selectedSummary.id
              }
              onBack={
                handleBackToPatient
              }
              onUpdated={
                (updated) => {
                  setSelectedSummary(
                    updated
                  );
                }
              }
            />
          ) : (
            <PatientOverview
              patient={
                selectedPatient
              }
              physician={physician}
              onSummarySelect={
                handleSummarySelect
              }
            />
          )}
        </section>
      </div>
    </div>
  );
}