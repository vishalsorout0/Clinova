export default function MedicationCard({
  medication,
}) {
  return (
    <div className="data-card">
      <div className="card-header-row">
        <h3>{medication.name}</h3>

        <span
          className={`status-badge status-${medication.status}`}
        >
          {medication.status}
        </span>
      </div>

      <p>
        <strong>Dosage:</strong>{" "}
        {medication.dosage || "Not specified"}
      </p>

      <p>
        <strong>Frequency:</strong>{" "}
        {medication.frequency || "Not specified"}
      </p>

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

      {medication.instructions && (
        <p>
          <strong>Instructions:</strong>{" "}
          {medication.instructions}
        </p>
      )}
    </div>
  );
}