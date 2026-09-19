import {
  useEffect,
  useState,
} from "react";

import {
  getAdminPatients,
} from "../../services/adminService";

import PatientTable from "../../components/admin/PatientTable";


export default function Patients() {
  const [patients, setPatients] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    async function loadPatients() {
      try {
        const response =
          await getAdminPatients();

        setPatients(
          Array.isArray(response)
            ? response
            : response?.patients || []
        );

      } catch (err) {
        setError(
          err.message ||
            "Unable to load patients."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPatients();
  }, []);


  return (
    <div className="admin-dashboard">

      <header className="admin-header">

        <span>
          CLINOVA ADMIN
        </span>

        <h1>
          Patients
        </h1>

        <p>
          View registered patient profiles.
        </p>

      </header>


      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}


      {loading ? (
        <div className="loading-state">
          Loading patients...
        </div>
      ) : (
        <section className="admin-section">

          <PatientTable
            patients={patients}
          />

        </section>
      )}

    </div>
  );
}