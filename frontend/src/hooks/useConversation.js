import { useCallback, useState } from "react";

import {
  createSession,
  createConversation,
  sendMessage,
  completeConversation,
  getNextQuestion,
  getAIExtract,
  getMissingInformation,
  getRedFlags,
  endSession,
  getPatientConversations,
  getConversation,
  getSession,
} from "../services/conversationService";

export function useConversation(patientId) {
  const [session, setSession] = useState(null);

  const [conversation, setConversation] =
    useState(null);

  const [conversations, setConversations] =
    useState([]);

  const [messages, setMessages] =
    useState([]);

  const [nextQuestion, setNextQuestion] =
    useState(null);

  const [extractedData, setExtractedData] =
    useState(null);

  const [missingInformation, setMissingInformation] =
    useState([]);

  const [redFlags, setRedFlags] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");

  const [completed, setCompleted] =
    useState(false);

  const [summary, setSummary] =
    useState(null);

  /*
   * Refresh AI information
   */
  const refreshAI = useCallback(
    async (conversationId) => {
      if (!conversationId) {
        return;
      }

      try {
        const [
          question,
          extract,
          missing,
          flags,
        ] = await Promise.allSettled([
          getNextQuestion(conversationId),
          getAIExtract(conversationId),
          getMissingInformation(conversationId),
          getRedFlags(conversationId),
        ]);

        if (question.status === "fulfilled") {
          setNextQuestion(question.value);
        }

        if (extract.status === "fulfilled") {
          setExtractedData(extract.value);
        }

        if (missing.status === "fulfilled") {
          setMissingInformation(
            normalizeMissingInformation(
              missing.value
            )
          );
        }

        if (flags.status === "fulfilled") {
          setRedFlags(flags.value);
        }
      } catch (err) {
        console.error(
          "AI refresh error:",
          err
        );
      }
    },
    []
  );

  /*
   * Load all patient conversations
   */
  const loadConversations = useCallback(
    async () => {
      if (!patientId) {
        return [];
      }

      const response =
        await getPatientConversations(
          patientId
        );

      const list =
        Array.isArray(response)
          ? response
          : response?.conversations || [];

      const sorted =
        [...list].sort(
          (a, b) =>
            new Date(
              b.started_at || 0
            ) -
            new Date(
              a.started_at || 0
            )
        );

      setConversations(sorted);

      return sorted;
    },
    [patientId]
  );

  /*
   * Load one specific conversation
   */
  const selectConversation =
    useCallback(
      async (conversationId) => {
        if (!conversationId) {
          return;
        }

        setLoading(true);
        setError("");

        try {
          const fullConversation =
            await getConversation(
              conversationId
            );

          setConversation(
            fullConversation
          );

          setMessages(
            Array.isArray(
              fullConversation.messages
            )
              ? fullConversation.messages
              : []
          );

          setCompleted(
            fullConversation.status ===
              "completed"
          );

          setSummary(null);

          /*
           * Restore session
           */
          if (
            fullConversation.session_id
          ) {
            try {
              const existingSession =
                await getSession(
                  fullConversation.session_id
                );

              setSession(
                existingSession
              );
            } catch (sessionError) {
              console.error(
                "Unable to restore session:",
                sessionError
              );

              setSession(null);
            }
          } else {
            setSession(null);
          }

          /*
           * Refresh AI information
           */
          await refreshAI(
            fullConversation.id
          );

          return fullConversation;
        } catch (err) {
          setError(
            err.message ||
              "Unable to load conversation."
          );

          throw err;
        } finally {
          setLoading(false);
        }
      },
      [refreshAI]
    );

  /*
   * Start consultation
   */
  const startConsultation =
    useCallback(
      async () => {
        if (!patientId) {
          throw new Error(
            "Patient ID is required."
          );
        }

        setLoading(true);
        setError("");

        try {
          /*
           * Load all conversations
           */
          const list =
            await loadConversations();

          /*
           * Find active conversations
           */
          const active =
            list.filter(
              (item) =>
                item.status === "active"
            );

          /*
           * If active chats exist,
           * open the latest one
           */
          if (active.length > 0) {
            const latestActive =
              active[0];

            const selected =
              await selectConversation(
                latestActive.id
              );

            return selected;
          }

          /*
           * No active chat
           * → create new session
           */
          const newSession =
            await createSession(
              patientId
            );

          setSession(
            newSession
          );

          /*
           * Create new conversation
           */
          const newConversation =
            await createConversation({
              patient_id: patientId,
              language: "en",
              session_id:
                newSession.id,
            });

          setConversation(
            newConversation
          );

          setMessages([]);

          setNextQuestion(null);
          setExtractedData(null);
          setMissingInformation([]);
          setRedFlags(null);
          setCompleted(false);
          setSummary(null);

          /*
           * Reload sidebar
           */
          await loadConversations();

          return newConversation;
        } catch (err) {
          setError(
            err.message ||
              "Unable to start consultation."
          );

          throw err;
        } finally {
          setLoading(false);
        }
      },
      [
        patientId,
        loadConversations,
        selectConversation,
      ]
    );

  /*
   * Send patient message
   */
  const sendPatientMessage =
    useCallback(
      async (content) => {
        if (!conversation?.id) {
          throw new Error(
            "No active conversation."
          );
        }

        if (!content?.trim()) {
          return;
        }

        setSending(true);
        setError("");

        try {
          const response =
            await sendMessage(
              conversation.id,
              {
                content:
                  content.trim(),
                input_type:
                  "text",
              }
            );

          /*
           * Reload complete conversation
           */
          const updatedConversation =
            await getConversation(
              conversation.id
            );

          setConversation(
            updatedConversation
          );

          setMessages(
            Array.isArray(
              updatedConversation.messages
            )
              ? updatedConversation.messages
              : []
          );

          /*
           * Refresh AI
           */
          await refreshAI(
            conversation.id
          );

          /*
           * Refresh sidebar
           */
          await loadConversations();

          return response;
        } catch (err) {
          setError(
            err.message ||
              "Unable to send message."
          );

          throw err;
        } finally {
          setSending(false);
        }
      },
      [
        conversation,
        refreshAI,
        loadConversations,
      ]
    );

  /*
   * Complete consultation
   */
  const complete =
    useCallback(
      async () => {
        if (!conversation?.id) {
          throw new Error(
            "No active conversation."
          );
        }

        setLoading(true);
        setError("");

        try {
          const response =
            await completeConversation(
              conversation.id
            );

          setCompleted(true);

          /*
           * Reload conversation
           */
          const updatedConversation =
            await getConversation(
              conversation.id
            );

          setConversation(
            updatedConversation
          );

          setMessages(
            Array.isArray(
              updatedConversation.messages
            )
              ? updatedConversation.messages
              : []
          );

          /*
           * End session
           */
          if (session?.id) {
            try {
              await endSession(
                session.id
              );

              setSession(
                (previous) =>
                  previous
                    ? {
                        ...previous,
                        status:
                          "completed",
                      }
                    : previous
              );
            } catch (sessionError) {
              console.error(
                "Unable to end session:",
                sessionError
              );
            }
          }

          /*
           * Refresh sidebar
           */
          await loadConversations();

          return response;
        } catch (err) {
          setError(
            err.message ||
              "Unable to complete consultation."
          );

          throw err;
        } finally {
          setLoading(false);
        }
      },
      [
        conversation,
        session,
        loadConversations,
      ]
    );

  /*
   * End session manually
   */
  const closeSession =
    useCallback(
      async () => {
        if (!session?.id) {
          return;
        }

        try {
          const response =
            await endSession(
              session.id
            );

          setSession(
            (previous) =>
              previous
                ? {
                    ...previous,
                    status:
                      "completed",
                  }
                : previous
          );

          return response;
        } catch (err) {
          console.error(
            "Unable to end session:",
            err
          );
        }
      },
      [session]
    );

  return {
    session,
    conversation,
    conversations,
    messages,

    nextQuestion,
    extractedData,
    missingInformation,
    redFlags,

    loading,
    sending,
    error,
    completed,

    summary,
    setSummary,

    startConsultation,
    loadConversations,
    selectConversation,
    sendPatientMessage,
    refreshAI,
    complete,
    closeSession,
  };
}

/*
 * Normalize missing information
 */
function normalizeMissingInformation(
  data
) {
  if (Array.isArray(data)) {
    return data;
  }

  if (
    Array.isArray(
      data?.missing_information
    )
  ) {
    return data.missing_information;
  }

  return [];
}