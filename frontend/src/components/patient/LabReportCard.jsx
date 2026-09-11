export default function LabReportCard({
  report,
}) {
  return (
    <div className="data-card">
      <div className="card-header-row">
        <h3>{report.test_name}</h3>

        <span
          className={`status-badge status-${report.status}`}
        >
          {report.status}
        </span>
      </div>

      <div className="lab-result">
        <strong>
          {report.result}
        </strong>

        {report.unit && (
          <span>{report.unit}</span>
        )}
      </div>

      {report.reference_range && (
        <p>
          <strong>Reference:</strong>{" "}
          {report.reference_range}
        </p>
      )}

      {report.report_date && (
        <small>
          Report date:{" "}
          {new Date(
            report.report_date
          ).toLocaleDateString()}
        </small>
      )}

      {report.report_text && (
        <p className="muted-text">
          {report.report_text}
        </p>
      )}
    </div>
  );
}