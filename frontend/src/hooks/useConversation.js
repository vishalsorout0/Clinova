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
} from "../services/conversationService";

export function useConversation(patientId) {
  const [session, setSession] =
    useState(null);

  const [conversation, setConversation] =
    useState(null);

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

  const startConsultation =
    useCallback(async () => {
      if (!patientId) {
        throw new Error(
          "Patient ID is required."
        );
      }

      setLoading(true);
      setError("");

      try {
        /*
         * 1. Create session
         */
        const newSession =
          await createSession(patientId);

        setSession(newSession);

        /*
         * Backend returns session id.
         * We use it to create the conversation.
         */
        const sessionId =
          newSession.id;

        /*
         * 2. Create conversation
         */
        const newConversation =
          await createConversation({
            patient_id: patientId,
            language: "en",
            session_id: sessionId,
          });

        setConversation(
          newConversation
        );

        setMessages([]);

        setCompleted(false);

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
    }, [patientId]);

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
          /*
           * Backend message schema:
           *
           * {
           *   content: "...",
           *   input_type: "text"
           * }
           */
          const response =
            await sendMessage(
              conversation.id,
              {
                content: content.trim(),
                input_type: "text",
              }
            );

          /*
           * Keep returned message.
           *
           * Depending on backend response shape,
           * normalize it into a frontend message.
           */
          const patientMessage =
            response?.message ||
            response;

          setMessages((previous) => [
            ...previous,
            {
              id:
                patientMessage?.id ||
                Date.now(),
              role: "patient",
              content:
                patientMessage?.content ||
                content.trim(),
              created_at:
                patientMessage?.created_at ||
                new Date().toISOString(),
            },
          ]);

          /*
           * Refresh AI information after
           * every patient response.
           */
          await refreshAI();

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
      [conversation]
    );

  const refreshAI = useCallback(
    async () => {
      if (!conversation?.id) {
        return;
      }

      try {
        const [
          question,
          extract,
          missing,
          flags,
        ] = await Promise.allSettled([
          getNextQuestion(
            conversation.id
          ),
          getAIExtract(
            conversation.id
          ),
          getMissingInformation(
            conversation.id
          ),
          getRedFlags(
            conversation.id
          ),
        ]);

        if (
          question.status ===
          "fulfilled"
        ) {
          setNextQuestion(
            question.value
          );
        }

        if (
          extract.status ===
          "fulfilled"
        ) {
          setExtractedData(
            extract.value
          );
        }

        if (
          missing.status ===
          "fulfilled"
        ) {
          setMissingInformation(
            normalizeMissingInformation(
              missing.value
            )
          );
        }

        if (
          flags.status ===
          "fulfilled"
        ) {
          setRedFlags(
            flags.value
          );
        }
      } catch (err) {
        console.error(
          "AI refresh error:",
          err
        );
      }
    },
    [conversation]
  );

  const complete =
    useCallback(async () => {
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
    }, [conversation]);

  const closeSession =
    useCallback(async () => {
      if (!session?.id) {
        return;
      }

      try {
        return await endSession(
          session.id
        );
      } catch (err) {
        console.error(
          "Unable to end session:",
          err
        );
      }
    }, [session]);

  return {
    session,
    conversation,
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
    sendPatientMessage,
    refreshAI,
    complete,
    closeSession,
  };
}

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