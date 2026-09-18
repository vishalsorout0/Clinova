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
  const { profile } = usePatient();

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
        setError("");

        const response =
          await getPatientConversations(
            profile.id
          );

        const conversations =
          Array.isArray(response)
            ? response
            : response?.conversations || [];

        // Find latest conversation that has messages
        const conversationWithMessages =
          [...conversations]
            .reverse()
            .find(
              (item) =>
                Array.isArray(item.messages) &&
                item.messages.length > 0
            );

        if (conversationWithMessages) {
          setConversation(
            conversationWithMessages
          );
        } else {
          setConversation(null);
          setError(
            "No consultation with messages found."
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
        !conversation &&
        !error && (
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