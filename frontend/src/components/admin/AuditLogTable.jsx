export default function AuditLogTable({
  logs = [],
}) {
  if (!logs.length) {
    return (
      <div className="empty-state">
        No audit logs found.
      </div>
    );
  }

  return (
    <div className="admin-table-wrapper">

      <table className="admin-table">

        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Action</th>
            <th>Entity</th>
            <th>Details</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>

          {logs.map((log) => (

            <tr key={log.id}>

              <td>
                {log.id}
              </td>

              <td>
                {log.user_id ?? "-"}
              </td>

              <td>
                {log.action}
              </td>

              <td>
                {log.entity_type
                  ? `${log.entity_type}${
                      log.entity_id
                        ? ` #${log.entity_id}`
                        : ""
                    }`
                  : "-"}
              </td>

              <td>
                {log.details || "-"}
              </td>

              <td>
                {formatDate(
                  log.created_at
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