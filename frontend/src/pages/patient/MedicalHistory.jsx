import { usePatient } from "../../hooks/usePatient";
import Loader from "../../components/common/Loader";

export default function MedicalHistory() {
  const {
    history,
    loading,
  } = usePatient();

  if (loading) {
    return (
      <Loader text="Loading medical history..." />
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Medical History</h1>
          <p>
            Your recorded medical history.
          </p>
        </div>
      </div>

      {!history.length ? (
        <div className="empty-state">
          No medical history records found.
        </div>
      ) : (
        <div className="card-grid">
          {history.map((item) => (
            <div
              className="data-card"
              key={item.id}
            >
              <h3>
                {item.condition ||
                  item.title ||
                  "Medical History"}
              </h3>

              {item.description && (
                <p>{item.description}</p>
              )}

              {item.diagnosis && (
                <p>
                  <strong>
                    Diagnosis:
                  </strong>{" "}
                  {item.diagnosis}
                </p>
              )}

              {item.treatment && (
                <p>
                  <strong>
                    Treatment:
                  </strong>{" "}
                  {item.treatment}
                </p>
              )}

              {item.created_at && (
                <small>
                  {new Date(
                    item.created_at
                  ).toLocaleString()}
                </small>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}