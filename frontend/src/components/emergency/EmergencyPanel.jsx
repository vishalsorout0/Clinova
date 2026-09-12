import { useState } from "react";

import EmergencyButton from "./EmergencyButton";
import EmergencyAlert from "./EmergencyAlert";

import {
  getEmergencyStatus,
  triggerEmergencyAlert,
} from "../../services/emergencyService";

export default function EmergencyPanel({
  conversationId,
}) {
  const [
    result,
    setResult,
  ] = useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function checkEmergency() {
    try {
      setLoading(true);
      setError("");

      const response =
        await getEmergencyStatus(
          conversationId
        );

      setResult(response);
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
    } catch (err) {
      setError(
        err.message ||
          "Unable to trigger emergency alert."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!conversationId) {
    return null;
  }

  return (
    <section className="emergency-panel">
      <div className="emergency-panel-header">
        <div>
          <span>
            Safety Check
          </span>

          <h3>
            Emergency Detection
          </h3>
        </div>

        <EmergencyButton
          onClick={
            checkEmergency
          }
          loading={loading}
        />
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <EmergencyAlert
        result={result}
      />

      {result?.result?.has_red_flags &&
        result?.result?.priority ===
          "urgent" && (
          <button
            type="button"
            className="trigger-emergency-button"
            onClick={handleAlert}
            disabled={loading}
          >
            🚨 Trigger Emergency Alert
          </button>
        )}
    </section>
  );
}