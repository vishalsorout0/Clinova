import ChatMessage from "./ChatMessage";

export default function ChatWindow({
  messages = [],
  nextQuestion,
}) {
  return (
    <div className="chat-window">
      {messages.length === 0 && (
        <div className="chat-welcome">
          <div className="chat-welcome-icon">
            C
          </div>

          <h2>
            Welcome to Clinova
          </h2>

          <p>
            Tell me what brings you here today.
            I'll ask a few questions to understand
            your symptoms and medical history.
          </p>
        </div>
      )}

      {messages.map((message, index) => (
        <ChatMessage
          key={
            message.id || index
          }
          message={message}
        />
      ))}

      {nextQuestion?.question && (
        <ChatMessage
          message={{
            role: "assistant",
            content:
              nextQuestion.question,
          }}
        />
      )}
    </div>
  );
}