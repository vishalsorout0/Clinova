import {
  useEffect,
  useState,
} from "react";

import {
  getUsers,
  getAdminPatients,
  getAdminPhysicians,
  getAdminSessions,
  getAuditLogs,
} from "../../services/adminService";

export default function AdminDashboard() {
  const [users, setUsers] =
    useState([]);

  const [patients, setPatients] =
    useState([]);

  const [physicians, setPhysicians] =
    useState([]);

  const [sessions, setSessions] =
    useState([]);

  const [auditLogs, setAuditLogs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);

        const [
          usersResponse,
          patientsResponse,
          physiciansResponse,
          sessionsResponse,
          logsResponse,
        ] = await Promise.all([
          getUsers(),
          getAdminPatients(),
          getAdminPhysicians(),
          getAdminSessions(),
          getAuditLogs(),
        ]);

        setUsers(
          normalizeList(usersResponse)
        );

        setPatients(
          normalizeList(
            patientsResponse
          )
        );

        setPhysicians(
          normalizeList(
            physiciansResponse
          )
        );

        setSessions(
          normalizeList(
            sessionsResponse
          )
        );

        setAuditLogs(
          normalizeList(logsResponse)
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to load admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, []);

  if (loading) {
    return (
      <div className="loading-state">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <span>
          CLINOVA ADMIN
        </span>

        <h1>
          System Dashboard
        </h1>

        <p>
          Monitor users, patients,
          physicians, sessions and audit
          activity.
        </p>
      </header>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="admin-stats">
        <Stat
          title="Users"
          value={users.length}
        />

        <Stat
          title="Patients"
          value={patients.length}
        />

        <Stat
          title="Physicians"
          value={physicians.length}
        />

        <Stat
          title="Sessions"
          value={sessions.length}
        />

        <Stat
          title="Audit Logs"
          value={auditLogs.length}
        />
      </div>

      <section className="admin-section">
        <h2>
          Recent Users
        </h2>

        <UserTable
          users={users.slice(0, 10)}
        />
      </section>
    </div>
  );
}

function Stat({
  title,
  value,
}) {
  return (
    <div className="admin-stat-card">
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}

function UserTable({
  users,
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
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>

              <td>
                {user.email}
              </td>

              <td>
                {user.role}
              </td>

              <td>
                {user.is_active === false
                  ? "Inactive"
                  : "Active"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function normalizeList(
  response
) {
  if (Array.isArray(response)) {
    return response;
  }

  return (
    response?.items ||
    response?.users ||
    response?.patients ||
    response?.physicians ||
    response?.sessions ||
    response?.audit_logs ||
    []
  );
}