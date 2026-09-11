import { Link } from "react-router-dom";

export default function ConsultationHeader({
  conversation,
  onComplete,
  completed,
  loading,
}) {
  return (
    <div className="consultation-header">
      <div>
        <Link
          to="/patient/dashboard"
          className="back-link"
        >
          ← Dashboard
        </Link>

        <h1>
          AI Consultation
        </h1>

        <p>
          Secure clinical history collection
        </p>
      </div>

      <div className="consultation-header-actions">
        {conversation?.id && (
          <span className="conversation-id">
            Consultation #{conversation.id}
          </span>
        )}

        {!completed && (
          <button
            type="button"
            className="complete-button"
            onClick={onComplete}
            disabled={loading}
          >
            {loading
              ? "Completing..."
              : "Complete"}
          </button>
        )}

        {completed && (
          <span className="completed-badge">
            Completed
          </span>
        )}
      </div>
    </div>
  );
}