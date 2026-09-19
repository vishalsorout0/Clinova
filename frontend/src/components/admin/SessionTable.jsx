export default function SessionTable({
  sessions = [],
}) {
  if (!sessions.length) {
    return (
      <div className="empty-state">
        No sessions found.
      </div>
    );
  }

  return (
    <div className="admin-table-wrapper">

      <table className="admin-table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Patient ID</th>
            <th>Status</th>
            <th>Created</th>
            <th>Expires</th>
          </tr>
        </thead>

        <tbody>

          {sessions.map((session) => (

            <tr key={session.id}>

              <td>
                {session.id}
              </td>

              <td>
                {session.patient_id}
              </td>

              <td>
                <span
                  className={
                    session.status ===
                    "active"
                      ? "admin-status active"
                      : "admin-status inactive"
                  }
                >
                  {session.status}
                </span>
              </td>

              <td>
                {formatDate(
                  session.created_at
                )}
              </td>

              <td>
                {formatDate(
                  session.expires_at
                )}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}


function formatDate(date) {
  if (!date) {
    return "-";
  }

  return new Date(
    date
  ).toLocaleString(
    "en-IN"
  );
}