import { useState } from "react";

export default function ChatInput({
  onSend,
  disabled = false,
}) {
  const [message, setMessage] =
    useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const value =
      message.trim();

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
          setMessage(
            event.target.value
          )
        }
        onKeyDown={handleKeyDown}
        placeholder="Describe your symptoms..."
        disabled={disabled}
        rows={2}
      />

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
    </form>
  );
}