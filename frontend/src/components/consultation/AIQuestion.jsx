export default function AIQuestion({
  question,
  onUseQuestion,
}) {
  if (!question) {
    return null;
  }

  const text =
    typeof question === "string"
      ? question
      : question.question;

  if (!text) {
    return null;
  }

  return (
    <div className="ai-question-card">
      <div className="ai-question-label">
        Clinova AI
      </div>

      <p>{text}</p>

      {onUseQuestion && (
        <button
          type="button"
          onClick={() =>
            onUseQuestion(text)
          }
        >
          Answer this question
        </button>
      )}
    </div>
  );
}