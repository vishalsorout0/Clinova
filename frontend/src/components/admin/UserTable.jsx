export default function UserTable({
  users = [],
  onRoleChange,
  onStatusChange,
}) {
  if (!users.length) {
    return (
      <div className="empty-state">
        No users found.
      </div>
    );
  }

  return (
    <div className="admin-table-wrapper">

      <table className="admin-table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {users.map((user) => (

            <tr key={user.id}>

              <td>
                {user.id}
              </td>

              <td>
                {user.email}
              </td>

              <td>
                <select
                  value={user.role}
                  onChange={(event) =>
                    onRoleChange?.(
                      user,
                      event.target.value
                    )
                  }
                  className="admin-select"
                >
                  <option value="patient">
                    Patient
                  </option>

                  <option value="physician">
                    Physician
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </select>
              </td>

              <td>
                <span
                  className={
                    user.is_active
                      ? "admin-status active"
                      : "admin-status inactive"
                  }
                >
                  {user.is_active
                    ? "Active"
                    : "Inactive"}
                </span>
              </td>

              <td>
                {formatDate(
                  user.created_at
                )}
              </td>

              <td>

                <button
                  type="button"
                  className="admin-action-button"
                  onClick={() =>
                    onStatusChange?.(
                      user,
                      !user.is_active
                    )
                  }
                >
                  {user.is_active
                    ? "Deactivate"
                    : "Activate"}
                </button>

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
  ).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}