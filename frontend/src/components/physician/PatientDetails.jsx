export default function PatientDetails({
  patient,
  physician,
}) {
  if (!patient) {
    return (
      <div className="physician-empty-panel">
        <div className="physician-empty-icon">
          +
        </div>

        <h2>
          Select a patient
        </h2>

        <p>
          Choose an authorized patient from
          the list to review their clinical
          information.
        </p>
      </div>
    );
  }

  return (
    <div className="patient-details-card">
      <div className="patient-details-header">
        <div className="large-patient-avatar">
          {getInitials(
            patient.full_name
          )}
        </div>

        <div>
          <h2>
            {patient.full_name ||
              `Patient #${patient.id}`}
          </h2>

          <p>
            Patient ID: {patient.id}
          </p>
        </div>

        <span className="authorized-badge">
          Authorized
        </span>
      </div>

      <div className="patient-details-grid">
        <Detail
          label="Patient ID"
          value={patient.id}
        />

        <Detail
          label="Full Name"
          value={
            patient.full_name ||
            "Not available"
          }
        />

        <Detail
          label="Date of Birth"
          value={
            patient.dob ||
            patient.date_of_birth ||
            "Not available"
          }
        />

        <Detail
          label="Gender"
          value={
            patient.gender ||
            "Not available"
          }
        />

        <Detail
          label="Phone"
          value={
            patient.phone ||
            "Not available"
          }
        />
      </div>

      {physician && (
        <div className="access-notice">
          <strong>
            Physician access
          </strong>

          <p>
            You are viewing data for this
            patient because explicit physician
            access has been granted.
          </p>
        </div>
      )}
    </div>
  );
}

function Detail({
  label,
  value,
}) {
  return (
    <div className="patient-detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) =>
      word[0].toUpperCase()
    )
    .join("");
}