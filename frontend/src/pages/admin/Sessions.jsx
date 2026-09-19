import {
  useEffect,
  useState,
} from "react";

import {
  getAdminSessions,
} from "../../services/adminService";

import SessionTable from "../../components/admin/SessionTable";


export default function Sessions() {
  const [sessions, setSessions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    async function loadSessions() {
      try {
        const response =
          await getAdminSessions();

        setSessions(
          Array.isArray(response)
            ? response
            : response?.sessions || []
        );

      } catch (err) {
        setError(
          err.message ||
            "Unable to load sessions."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSessions();
  }, []);


  return (
    <div className="admin-dashboard">

      <header className="admin-header">

        <span>
          CLINOVA ADMIN
        </span>

        <h1>
          Sessions
        </h1>

        <p>
          Monitor patient session activity.
        </p>

      </header>


      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}


      {loading ? (
        <div className="loading-state">
          Loading sessions...
        </div>
      ) : (
        <section className="admin-section">

          <SessionTable
            sessions={sessions}
          />

        </section>
      )}

    </div>
  );
}