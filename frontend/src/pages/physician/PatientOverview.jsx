import {
  useEffect,
  useState,
} from "react";

import {
  getPatientSummaries,
} from "../../services/physicianService";

import PatientDetails from "../../components/physician/PatientDetails";

export default function PatientOverview({
  patient,
  physician,
  onSummarySelect,
}) {
  const [
    summaries,
    setSummaries,
  ] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!patient?.id) {
      setSummaries([]);
      return;
    }

    async function loadSummaries() {
      try {
        setLoading(true);
        setError("");

        const response =
          await getPatientSummaries(
            patient.id
          );

        setSummaries(
          Array.isArray(response)
            ? response
            : response?.summaries ||
                []
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to load patient summaries."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSummaries();
  }, [patient?.id]);

  return (
    <div className="patient-overview-page">
      <PatientDetails
        patient={patient}
        physician={physician}
      />

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <section className="patient-summaries-section">
        <div className="section-heading">
          <div>
            <span className="section-label">
              Clinical Records
            </span>

            <h2>
              Clinical Summaries
            </h2>
          </div>

          <span>
            {summaries.length} summaries
          </span>
        </div>

        {loading && (
          <div className="loading-state">
            Loading summaries...
          </div>
        )}

        {!loading &&
          summaries.length === 0 && (
            <div className="empty-state">
              <h3>
                No summaries available
              </h3>

              <p>
                This patient does not have
                any clinical summaries yet.
              </p>
            </div>
          )}

        <div className="summary-list">
          {summaries.map(
            (summary) => (
              <button
                type="button"
                className="summary-list-item"
                key={summary.id}
                onClick={() =>
                  onSummarySelect(
                    summary
                  )
                }
              >
                <div>
                  <strong>
                    Summary #{summary.id}
                  </strong>

                  <p>
                    {truncate(
                      summary.summary,
                      150
                    )}
                  </p>
                </div>

                <div className="summary-list-meta">
                  <span
                    className={`summary-status status-${summary.status}`}
                  >
                    {summary.status}
                  </span>

                  <span>
                    →
                  </span>
                </div>
              </button>
            )
          )}
        </div>
      </section>
    </div>
  );
}

function truncate(
  text = "",
  length
) {
  if (text.length <= length) {
    return text;
  }

  return (
    text.slice(0, length) +
    "..."
  );
}