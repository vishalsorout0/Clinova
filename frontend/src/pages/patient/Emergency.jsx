import {
  useEffect,
  useState,
} from "react";

import {
  getPatientConversations,
} from "../../services/conversationService";

import { usePatient } from "../../hooks/usePatient";

import EmergencyPanel from "../../components/emergency/EmergencyPanel";

export default function Emergency() {
  const { profile } =
    usePatient();

  const [
    conversation,
    setConversation,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!profile?.id) {
      return;
    }

    async function loadConversation() {
      try {
        setLoading(true);

        const response =
          await getPatientConversations(
            profile.id
          );

        const conversations =
          Array.isArray(response)
            ? response
            : response?.conversations ||
              [];

        if (conversations.length > 0) {
          setConversation(
            conversations[
              conversations.length - 1
            ]
          );
        }
      } catch (err) {
        setError(
          err.message ||
            "Unable to load consultation."
        );
      } finally {
        setLoading(false);
      }
    }

    loadConversation();
  }, [profile?.id]);

  return (
    <div className="emergency-page">
      <div className="page-header">
        <span>
          CLINOVA SAFETY
        </span>

        <h1>
          Emergency Support
        </h1>

        <p>
          Check the latest consultation
          for emergency indicators.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {loading && (
        <div className="loading-state">
          Loading...
        </div>
      )}

      {!loading &&
        !conversation && (
          <div className="empty-state">
            No consultation found.
          </div>
        )}

      {conversation && (
        <EmergencyPanel
          conversationId={
            conversation.id
          }
        />
      )}
    </div>
  );
}