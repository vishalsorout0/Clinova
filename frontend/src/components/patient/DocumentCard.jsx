export default function DocumentCard({
  document,
  onDelete,
  onOCR,
}) {
  return (
    <div className="data-card">
      <div className="card-header-row">
        <h3>
          {document.file_name ||
            document.filename ||
            "Medical Document"}
        </h3>

        {document.document_type && (
          <span className="status-badge">
            {document.document_type}
          </span>
        )}
      </div>

      {document.description && (
        <p>{document.description}</p>
      )}

      {document.uploaded_at && (
        <small>
          Uploaded:{" "}
          {new Date(
            document.uploaded_at
          ).toLocaleString()}
        </small>
      )}

      <div className="card-actions">
        {onOCR && (
          <button
            className="small-btn"
            onClick={() => onOCR(document.id)}
          >
            Run OCR
          </button>
        )}

        {onDelete && (
          <button
            className="small-btn danger-btn"
            onClick={() =>
              onDelete(document.id)
            }
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}