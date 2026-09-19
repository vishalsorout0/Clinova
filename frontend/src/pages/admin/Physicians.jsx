import {
  useEffect,
  useState,
} from "react";

import {
  getAdminPhysicians,
} from "../../services/adminService";

import PhysicianTable from "../../components/admin/PhysicianTable";


export default function Physicians() {
  const [physicians, setPhysicians] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    async function loadPhysicians() {
      try {
        const response =
          await getAdminPhysicians();

        setPhysicians(
          Array.isArray(response)
            ? response
            : response?.physicians || []
        );

      } catch (err) {
        setError(
          err.message ||
            "Unable to load physicians."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPhysicians();
  }, []);


  return (
    <div className="admin-dashboard">

      <header className="admin-header">

        <span>
          CLINOVA ADMIN
        </span>

        <h1>
          Physicians
        </h1>

        <p>
          View registered physician profiles.
        </p>

      </header>


      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}


      {loading ? (
        <div className="loading-state">
          Loading physicians...
        </div>
      ) : (
        <section className="admin-section">

          <PhysicianTable
            physicians={physicians}
          />

        </section>
      )}

    </div>
  );
}