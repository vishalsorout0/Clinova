export default function Timeline({
  items = [],
}) {
  if (!items.length) {
    return (
      <div className="empty-state">
        No timeline data available.
      </div>
    );
  }

  return (
    <div className="timeline">
      {items.map((item, index) => (
        <div
          className="timeline-item"
          key={
            item.id ||
            `${item.type}-${index}`
          }
        >
          <div className="timeline-dot" />

          <div className="timeline-content">
            <div className="card-header-row">
              <h3>
                {item.title ||
                  item.type ||
                  "Medical Event"}
              </h3>

              {item.created_at && (
                <small>
                  {new Date(
                    item.created_at
                  ).toLocaleString()}
                </small>
              )}
            </div>

            {item.description && (
              <p>{item.description}</p>
            )}

            {item.summary && (
              <p>{item.summary}</p>
            )}

            {item.result && (
              <p>
                Result: {item.result}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}