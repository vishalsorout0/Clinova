import PhysicianNotes from "./PhysicianNotes";

export default function SummaryReview({
  summary,
  summaryText,
  physicianNotes,
  onSummaryChange,
  onNotesChange,
  onSave,
  onVerify,
  onReject,
  saving = false,
  verifying = false,
  rejecting = false,
}) {
  if (!summary) {
    return (
      <div className="physician-empty-panel">
        <h2>
          No summary selected
        </h2>

        <p>
          Select a clinical summary to
          review it.
        </p>
      </div>
    );
  }

  const isVerified =
    summary.status === "verified";

  const isRejected =
    summary.status === "rejected";

  return (
    <div className="summary-review-card">
      <div className="summary-review-header">
        <div>
          <span className="section-label">
            Clinical Summary
          </span>

          <h2>
            Summary #{summary.id}
          </h2>
        </div>

        <StatusBadge
          status={summary.status}
        />
      </div>

      <div className="summary-meta">
        <span>
          Patient ID:{" "}
          {summary.patient_id}
        </span>

        {summary.conversation_id && (
          <span>
            Conversation:{" "}
            {summary.conversation_id}
          </span>
        )}

        {summary.created_at && (
          <span>
            Created:{" "}
            {new Date(
              summary.created_at
            ).toLocaleString()}
          </span>
        )}
      </div>

      <div className="summary-editor">
        <label htmlFor="clinical-summary">
          AI Clinical Summary
        </label>

        <textarea
          id="clinical-summary"
          value={summaryText}
          onChange={(event) =>
            onSummaryChange(
              event.target.value
            )
          }
          rows={12}
          disabled={
            saving ||
            verifying ||
            rejecting ||
            isVerified
          }
        />
      </div>

      <PhysicianNotes
        value={physicianNotes}
        onChange={onNotesChange}
        disabled={
          saving ||
          verifying ||
          rejecting ||
          isVerified
        }
      />

      {summary.physician_notes &&
        physicianNotes === "" && (
          <div className="existing-notes">
            <strong>
              Previous physician notes
            </strong>

            <p>
              {summary.physician_notes}
            </p>
          </div>
        )}

      <div className="summary-actions">
        {!isVerified &&
          !isRejected && (
            <>
              <button
                type="button"
                className="save-summary-button"
                onClick={onSave}
                disabled={
                  saving ||
                  !summaryText.trim()
                }
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <button
                type="button"
                className="reject-summary-button"
                onClick={onReject}
                disabled={
                  rejecting
                }
              >
                {rejecting
                  ? "Rejecting..."
                  : "Reject"}
              </button>

              <button
                type="button"
                className="verify-summary-button"
                onClick={onVerify}
                disabled={
                  verifying
                }
              >
                {verifying
                  ? "Verifying..."
                  : "Verify Summary"}
              </button>
            </>
          )}
      </div>

      {isVerified && (
        <div className="review-final-message verified">
          ✓ This summary has been verified
          by the physician.
        </div>
      )}

      {isRejected && (
        <div className="review-final-message rejected">
          This summary has been rejected by
          the physician.
        </div>
      )}
    </div>
  );
}

function StatusBadge({
  status,
}) {
  return (
    <span
      className={`summary-status status-${status}`}
    >
      {status || "draft"}
    </span>
  );
}