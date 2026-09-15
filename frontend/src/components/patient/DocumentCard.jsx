import { useState } from "react";

export default function DocumentCard({
  document,
  onDelete,
  onOCR,
}) {
  const [showOCR, setShowOCR] = useState(false);

  const hasOCRText =
    typeof document.ocr_text === "string" &&
    document.ocr_text.trim().length > 0;

  return (
    <>
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

        {hasOCRText && (
          <div className="ocr-status">
            <span className="status-badge status-verified">
              OCR Completed
            </span>
          </div>
        )}

        <div className="card-actions">
          {onOCR && (
            <button
              type="button"
              className="small-btn"
              onClick={() => onOCR(document.id)}
            >
              {hasOCRText
                ? "Run OCR Again"
                : "Run OCR"}
            </button>
          )}

          {hasOCRText && (
            <button
              type="button"
              className="small-btn"
              onClick={() => setShowOCR(true)}
            >
              View Extracted Text
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              className="small-btn danger-btn"
              onClick={() => onDelete(document.id)}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {showOCR && (
        <div
          className="modal-overlay"
          onClick={() => setShowOCR(false)}
        >
          <div
            className="modal ocr-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <h2>Extracted Text</h2>

              <button
                type="button"
                className="modal-close"
                onClick={() => setShowOCR(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="ocr-document-name">
                <strong>
                  {document.file_name ||
                    document.filename ||
                    "Medical Document"}
                </strong>
              </div>

              <div className="ocr-text-box">
                {hasOCRText
                  ? document.ocr_text
                  : "No extracted text available."}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

