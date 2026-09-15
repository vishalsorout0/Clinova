import { useEffect, useRef, useState } from "react";

export default function ChatInput({
  onSend,
  disabled = false,
}) {
  const [message, setMessage] = useState("");
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0].transcript;
      }

      setMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  function handleSpeech() {
    if (disabled || !speechSupported) {
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    try {
      recognitionRef.current?.start();
    } catch (error) {
      console.error(
        "Unable to start speech recognition:",
        error
      );
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const value = message.trim();

    if (!value || disabled) {
      return;
    }

    await onSend(value);

    setMessage("");
  }

  function handleKeyDown(event) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      handleSubmit(event);
    }
  }

  return (
    <form
      className="chat-input-container"
      onSubmit={handleSubmit}
    >
      <textarea
        value={message}
        onChange={(event) =>
          setMessage(event.target.value)
        }
        onKeyDown={handleKeyDown}
        placeholder={
          listening
            ? "Listening..."
            : "Describe your symptoms..."
        }
        disabled={disabled}
        rows={2}
      />

      <div className="chat-input-actions">
        {speechSupported && (
          <button
            type="button"
            onClick={handleSpeech}
            disabled={disabled}
            className={`chat-mic-button ${
              listening
                ? "chat-mic-listening"
                : ""
            }`}
            title={
              listening
                ? "Stop listening"
                : "Speak your message"
            }
          >
            {listening ? "⏹️" : "🎤"}
          </button>
        )}

        <button
          type="submit"
          disabled={
            disabled ||
            !message.trim()
          }
          className="chat-send-button"
        >
          Send
        </button>
      </div>
    </form>
  );
}