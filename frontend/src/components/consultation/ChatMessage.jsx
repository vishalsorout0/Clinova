export default function ChatMessage({
  message,
}) {
  const isPatient =
    message.role === "patient";

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