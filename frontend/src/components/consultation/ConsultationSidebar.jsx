export default function ConsultationSidebar({
  conversations,
  selectedConversationId,
  onSelect,
}) {
  const activeConversations =
    conversations.filter(
      (conversation) =>
        conversation.status === "active"
    );

  return (
    <aside className="consultation-sidebar-list">
      <div className="consultation-sidebar-title">
        <span>CLINOVA</span>
        <h2>My Consultations</h2>
        <p>
          Active conversations
        </p>
      </div>

      <div className="consultation-list">
        {activeConversations.length === 0 ? (
          <div className="no-consultations">
            No active consultations.
          </div>
        ) : (
          activeConversations.map(
            (item) => {
              const messages =
                Array.isArray(
                  item.messages
                )
                  ? item.messages
                  : [];

              const lastMessage =
                messages.length > 0
                  ? messages[
                      messages.length - 1
                    ]
                  : null;

              const isSelected =
                item.id ===
                selectedConversationId;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`consultation-list-item ${
                    isSelected
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    onSelect(item.id)
                  }
                >
                  <div className="consultation-item-top">
                    <span className="active-dot">
                      ●
                    </span>

                    <span className="consultation-date">
                      {formatDate(
                        item.started_at
                      )}
                    </span>
                  </div>

                  <div className="consultation-item-title">
                    Consultation #{item.id}
                  </div>

                  <div className="consultation-item-preview">
                    {lastMessage
                      ? lastMessage.content
                      : "New consultation"}
                  </div>
                </button>
              );
            }
          )
        )}
      </div>
    </aside>
  );
}

function formatDate(date) {
  if (!date) {
    return "";
  }

  try {
    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
      }
    );
  } catch {
    return "";
  }
}