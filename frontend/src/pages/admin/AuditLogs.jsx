import {
  useEffect,
  useState,
} from "react";

import {
  getAuditLogs,
} from "../../services/adminService";

import AuditLogTable from "../../components/admin/AuditLogTable";


export default function AuditLogs() {
  const [logs, setLogs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    async function loadLogs() {
      try {
        const response =
          await getAuditLogs();

        setLogs(
          Array.isArray(response)
            ? response
            : response?.audit_logs || []
        );

      } catch (err) {
        setError(
          err.message ||
            "Unable to load audit logs."
        );
      } finally {
        setLoading(false);
      }
    }

    loadLogs();
  }, []);


  return (
    <div className="admin-dashboard">

      <header className="admin-header">

        <span>
          CLINOVA ADMIN
        </span>

        <h1>
          Audit Logs
        </h1>

        <p>
          Review system activity and
          administrative actions.
        </p>

      </header>


      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}


      {loading ? (
        <div className="loading-state">
          Loading audit logs...
        </div>
      ) : (
        <section className="admin-section">

          <AuditLogTable
            logs={logs}
          />

        </section>
      )}

    </div>
  );
}