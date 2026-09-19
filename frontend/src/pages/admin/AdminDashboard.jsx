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
  updateUserRole,
  updateUserStatus,
} from "../../services/adminService";

import AdminStats from "../../components/admin/AdminStats";
import UserTable from "../../components/admin/UserTable";


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


  async function loadAdminData() {
    try {
      setLoading(true);
      setError("");

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


  useEffect(() => {
    loadAdminData();
  }, []);


  async function handleRoleChange(
    user,
    role
  ) {
    if (role === user.role) {
      return;
    }

    try {
      await updateUserRole(
        user.id,
        role
      );

      await loadAdminData();

    } catch (err) {
      setError(
        err.message ||
          "Unable to update user role."
      );
    }
  }


  async function handleStatusChange(
    user,
    isActive
  ) {
    try {
      await updateUserStatus(
        user.id,
        isActive
      );

      await loadAdminData();

    } catch (err) {
      setError(
        err.message ||
          "Unable to update user status."
      );
    }
  }


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


      <AdminStats
        users={users}
        patients={patients}
        physicians={physicians}
        sessions={sessions}
        auditLogs={auditLogs}
      />


      <section className="admin-section">

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            marginBottom: "16px",
          }}
        >

          <div>
            <h2>
              Recent Users
            </h2>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Manage user roles and account
              status.
            </p>
          </div>

        </div>


        <UserTable
          users={users.slice(0, 10)}
          onRoleChange={
            handleRoleChange
          }
          onStatusChange={
            handleStatusChange
          }
        />

      </section>

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