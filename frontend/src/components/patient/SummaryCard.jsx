export default function SummaryCard({ summary }) {
  if (!summary) {
    return null;
  }

  return (
    <div className="data-card">
      <div className="card-header-row">
        <h3>Clinical Summary</h3>

        <span
          className={`status-badge status-${summary.status}`}
        >
          {summary.status}
        </span>
      </div>

      <p className="summary-text">
        {summary.summary}
      </p>

      {summary.physician_notes && (
        <div className="physician-note">
          <strong>Physician Notes</strong>
          <p>{summary.physician_notes}</p>
        </div>
      )}

      {summary.created_at && (
        <small>
          Created:{" "}
          {new Date(
            summary.created_at
          ).toLocaleString()}
        </small>
      )}
    </div>
  );
}