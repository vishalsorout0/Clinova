import { useEffect, useState } from "react";

import Loader from "../../components/common/Loader";
import { usePatient } from "../../hooks/usePatient";
import { getPatientMedications } from "../../services/documentService";

function getMedicationStatus(startDate, endDate) {
  // Get today's date in the user's local timezone
  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  if (!startDate && !endDate) {
    return "Unknown";
  }

  const start = startDate
    ? new Date(`${startDate}T00:00:00`)
    : null;

  const end = endDate
    ? new Date(`${endDate}T23:59:59`)
    : null;

  if (start && today < start) {
    return "Upcoming";
  }

  if (end && today > end) {
    return "Completed";
  }

  return "Active";
}

function getStatusClass(status) {
  if (status === "Active") {
    return "medication-status active";
  }

  if (status === "Upcoming") {
    return "medication-status upcoming";
  }

  if (status === "Completed") {
    return "medication-status completed";
  }

  return "medication-status";
}

export default function Medications() {
  const { profile } = usePatient();

  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile?.id) {
      loadMedications();
    }
  }, [profile?.id]);

  async function loadMedications() {
    setLoading(true);
    setError("");

    try {
      const data =
        await getPatientMedications(profile.id);

      setMedications(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to load medications."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Loader text="Loading your medications..." />
    );
  }

  return (
    <div className="dashboard-page">

      <div className="page-header">
        <div>
          <h1>My Medications</h1>

          <p>
            View your current and previous medications.
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {medications.length === 0 ? (
        <div className="empty-state">
          No medications found.
        </div>
      ) : (
        <div className="card-grid">

          {medications.map((medication) => {
            const status = getMedicationStatus(
              medication.start_date,
              medication.end_date
            );

            return (
              <div
                className="data-card medication-card"
                key={medication.id}
              >

                <div className="card-header-row">

                  <h2>
                    {medication.name ||
                      "Medication"}
                  </h2>

                  <span
                    className={getStatusClass(status)}
                  >
                    {status}
                  </span>

                </div>

                <div className="medication-details">

                  {medication.dosage && (
                    <p>
                      <strong>Dosage:</strong>{" "}
                      {medication.dosage}
                    </p>
                  )}

                  {medication.frequency && (
                    <p>
                      <strong>Frequency:</strong>{" "}
                      {medication.frequency}
                    </p>
                  )}

                  {medication.duration && (
                    <p>
                      <strong>Duration:</strong>{" "}
                      {medication.duration}
                    </p>
                  )}

                  {medication.route && (
                    <p>
                      <strong>Route:</strong>{" "}
                      {medication.route}
                    </p>
                  )}

                  {medication.start_date && (
                    <p>
                      <strong>Start Date:</strong>{" "}
                      {medication.start_date}
                    </p>
                  )}

                  {medication.end_date && (
                    <p>
                      <strong>End Date:</strong>{" "}
                      {medication.end_date}
                    </p>
                  )}

                  {medication.instructions && (
                    <div className="medication-instructions">
                      <strong>Instructions</strong>

                      <p>
                        {medication.instructions}
                      </p>
                    </div>
                  )}

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}