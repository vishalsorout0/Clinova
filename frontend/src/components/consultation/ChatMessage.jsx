import { useEffect, useState } from "react";

export default function ChatMessage({
  message,
}) {
  const isPatient =
    message.role === "patient";

  const [speaking, setSpeaking] =
    useState(false);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  function handleSpeak() {
    if (
      !message.content ||
      !("speechSynthesis" in window)
    ) {
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        message.content
      );

    utterance.lang = "en-IN";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setSpeaking(true);
    };

    utterance.onend = () => {
      setSpeaking(false);
    };

    utterance.onerror = () => {
      setSpeaking(false);
    };

    window.speechSynthesis.speak(
      utterance
    );
  }

  return (
    <div
      className={`chat-message ${
        isPatient
          ? "chat-message-patient"
          : "chat-message-ai"
      }`}
    >
      <div className="chat-avatar">
        {isPatient ? "P" : "C"}
      </div>

      <div className="chat-bubble">
        <div className="chat-role">
          {isPatient
            ? "You"
            : "Clinova AI"}
        </div>

        <p>{message.content}</p>

        {!isPatient && (
          <button
            type="button"
            className={`chat-speak-button ${
              speaking
                ? "chat-speak-speaking"
                : ""
            }`}
            onClick={handleSpeak}
            title={
              speaking
                ? "Stop speaking"
                : "Listen to AI response"
            }
          >
            {speaking
              ? "⏹️ Stop"
              : "🔊 Listen"}
          </button>
        )}

        {message.created_at && (
          <small>
            {new Date(
              message.created_at
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </small>
        )}
      </div>
    </div>
  );
}