import { useEffect, useState } from "react";

import EmergencyButton from "./EmergencyButton";
import EmergencyAlert from "./EmergencyAlert";

import {
  getEmergencyStatus,
  triggerEmergencyAlert,
} from "../../services/emergencyService";

export default function EmergencyPanel({
  conversationId,
}) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dismissed, setDismissed] = useState(false);

  const dismissKey =
    `clinova-emergency-dismissed-${conversationId}`;

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    const saved =
      localStorage.getItem(dismissKey);

    if (saved === "true") {
      setDismissed(true);
      setResult(null);
    } else {
      setDismissed(false);
    }
  }, [conversationId]);

  async function checkEmergency() {
    try {
      setLoading(true);
      setError("");

      const response =
        await getEmergencyStatus(conversationId);

      setResult(response);

      // New safety check = show fresh result
      setDismissed(false);

      localStorage.removeItem(dismissKey);
    } catch (err) {
      setError(
        err.message ||
          "Unable to check emergency status."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleAlert() {
    try {
      setLoading(true);
      setError("");

      const response =
        await triggerEmergencyAlert(
          conversationId
        );

      setResult(response);
      setDismissed(false);

      localStorage.removeItem(dismissKey);
    } catch (err) {
      setError(
        err.message ||
          "Unable to create emergency alert."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleDismiss() {
    // Completely remove emergency result
    setResult(null);

    // Hide emergency UI
    setDismissed(true);

    // Remember dismissal for this conversation
    localStorage.setItem(
      dismissKey,
      "true"
    );
  }

  if (!conversationId) {
    return null;
  }

  const hasEmergency =
    result?.has_emergency === true ||
    result?.status === "emergency";

  return (
    <section className="emergency-panel">

      <div className="emergency-panel-header">

        <div>
          <span>Safety Check</span>

          <h3>
            Emergency Detection
          </h3>
        </div>

        <EmergencyButton
          onClick={checkEmergency}
          loading={loading}
        />

      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* EMERGENCY ALERT */}
      {!dismissed && result && (
        <EmergencyAlert
          result={result}
        />
      )}

      {/* EMERGENCY ACTIONS */}
      {!dismissed && hasEmergency && (
        <div className="emergency-actions">

          <button
            type="button"
            className="trigger-emergency-button"
            onClick={handleAlert}
            disabled={loading}
          >
            🚨 Trigger Emergency Alert
          </button>

          <button
            type="button"
            className="dismiss-emergency-button"
            onClick={handleDismiss}
            disabled={loading}
          >
            ✓ I’m OK — Dismiss
          </button>

        </div>
      )}

      {/* AFTER DISMISS */}
      {dismissed && (
        <div className="emergency-dismissed">

          <span>✓</span>

          <div>
            <strong>
              You marked yourself as OK.
            </strong>

            <p>
              The emergency alert has been dismissed.
            </p>
          </div>

        </div>
      )}

    </section>
  );
}