import {
  useEffect,
  useState,
} from "react";

import {
  getPhysicianSummary,
  updatePhysicianSummary,
  verifySummary,
  rejectSummary,
} from "../../services/physicianService";

import SummaryReviewComponent from "../../components/physician/SummaryReview";

export default function SummaryReview({
  summaryId,
  onBack,
  onUpdated,
}) {
  const [
    summary,
    setSummary,
  ] = useState(null);

  const [
    summaryText,
    setSummaryText,
  ] = useState("");

  const [
    physicianNotes,
    setPhysicianNotes,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [verifying, setVerifying] =
    useState(false);

  const [rejecting, setRejecting] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!summaryId) {
      return;
    }

    async function loadSummary() {
      try {
        setLoading(true);
        setError("");

        const response =
          await getPhysicianSummary(
            summaryId
          );

        setSummary(response);

        setSummaryText(
          response.summary || ""
        );

        setPhysicianNotes(
          response.physician_notes ||
            ""
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to load summary."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, [summaryId]);

  async function handleSave() {
    try {
      setSaving(true);
      setError("");

      const updated =
        await updatePhysicianSummary(
          summaryId,
          {
            summary:
              summaryText.trim(),

            physician_notes:
              physicianNotes.trim() ||
              null,
          }
        );

      setSummary(updated);

      setSummaryText(
        updated.summary || ""
      );

      setPhysicianNotes(
        updated.physician_notes ||
          ""
      );

      onUpdated?.(updated);
    } catch (err) {
      setError(
        err.message ||
          "Unable to save summary."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleVerify() {
    try {
      setVerifying(true);
      setError("");

      /*
       * Save current edits first.
       */
      const updated =
        await updatePhysicianSummary(
          summaryId,
          {
            summary:
              summaryText.trim(),

            physician_notes:
              physicianNotes.trim() ||
              null,
          }
        );

      /*
       * Then verify.
       */
      const verified =
        await verifySummary(
          summaryId,
          physicianNotes.trim()
        );

      setSummary(
        verified || updated
      );

      onUpdated?.(
        verified || updated
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to verify summary."
      );
    } finally {
      setVerifying(false);
    }
  }

  async function handleReject() {
    try {
      setRejecting(true);
      setError("");

      /*
       * Save edits before rejection.
       */
      await updatePhysicianSummary(
        summaryId,
        {
          summary:
            summaryText.trim(),

          physician_notes:
            physicianNotes.trim() ||
            null,
        }
      );

      const rejected =
        await rejectSummary(
          summaryId,
          physicianNotes.trim()
        );

      setSummary(rejected);

      onUpdated?.(rejected);
    } catch (err) {
      setError(
        err.message ||
          "Unable to reject summary."
      );
    } finally {
      setRejecting(false);
    }
  }

  if (loading) {
    return (
      <div className="loading-state">
        Loading clinical summary...
      </div>
    );
  }

  return (
    <div className="physician-summary-review-page">
      <div className="review-page-topbar">
        <button
          type="button"
          onClick={onBack}
          className="back-button"
        >
          ← Back
        </button>

        <h1>
          Physician Review
        </h1>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <SummaryReviewComponent
        summary={summary}
        summaryText={summaryText}
        physicianNotes={physicianNotes}
        onSummaryChange={
          setSummaryText
        }
        onNotesChange={
          setPhysicianNotes
        }
        onSave={handleSave}
        onVerify={handleVerify}
        onReject={handleReject}
        saving={saving}
        verifying={verifying}
        rejecting={rejecting}
      />
    </div>
  );
}