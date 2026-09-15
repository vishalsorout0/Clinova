import { useEffect, useState } from "react";

import Loader from "../../components/common/Loader";

import {
  getAvailablePhysicians,
} from "../../services/physicianService";

import {
  createConsent,
  getPatientConsents,
  revokeConsent,
} from "../../services/consentService";

import { usePatient } from "../../hooks/usePatient";

export default function Doctors() {
  const { profile } = usePatient();

  const [doctors, setDoctors] = useState([]);
  const [consents, setConsents] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionDoctorId, setActionDoctorId] =
    useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (profile?.id) {
      loadData();
    }
  }, [profile?.id]);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [
        doctorData,
        consentData,
      ] = await Promise.all([
        getAvailablePhysicians(),
        getPatientConsents(profile.id),
      ]);

      setDoctors(
        Array.isArray(doctorData)
          ? doctorData
          : []
      );

      setConsents(
        Array.isArray(consentData)
          ? consentData
          : []
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to load doctors."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(event) {
    event.preventDefault();

    setError("");

    try {
      const data =
        await getAvailablePhysicians(search);

      setDoctors(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to search doctors."
      );
    }
  }

  function getLatestConsent(doctorId) {
    return consents
      .filter(
        (consent) =>
          consent.physician_id === doctorId &&
          consent.consent_type ===
            "physician_access"
      )
      .sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      )[0];
  }

  function hasConsent(doctorId) {
    const consent =
      getLatestConsent(doctorId);

    return (
      consent?.granted === true
    );
  }

  async function handleGrantConsent(
    doctorId
  ) {
    setActionDoctorId(doctorId);
    setError("");
    setMessage("");

    try {
      const consent =
        await createConsent({
          patient_id: profile.id,
          physician_id: doctorId,
          consent_type:
            "physician_access",
          granted: true,
        });

      setConsents((current) => [
        consent,
        ...current,
      ]);

      setMessage(
        "Consent granted successfully. The doctor can now access your authorized health information."
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to grant consent."
      );
    } finally {
      setActionDoctorId(null);
    }
  }

  async function handleRevokeConsent(
    doctorId
  ) {
    const consent =
      getLatestConsent(doctorId);

    if (!consent) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to remove this doctor's access to your health information?"
      );

    if (!confirmed) {
      return;
    }

    setActionDoctorId(doctorId);
    setError("");
    setMessage("");

    try {
      await revokeConsent(
        consent.id
      );

      setConsents((current) =>
        current.map((item) =>
          item.id === consent.id
            ? {
                ...item,
                granted: false,
              }
            : item
        )
      );

      setMessage(
        "Consent removed successfully. This doctor can no longer access your authorized health information."
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to remove consent."
      );
    } finally {
      setActionDoctorId(null);
    }
  }

  if (loading) {
    return (
      <Loader text="Loading doctors..." />
    );
  }

  return (
    <div className="dashboard-page">

      <div className="page-header">
        <div>
          <h1>My Doctors</h1>

          <p>
            Search doctors and manage access to
            your health information.
          </p>
        </div>
      </div>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* SEARCH */}
      <section className="doctor-search-section">

        <form
          onSubmit={handleSearch}
          className="doctor-search"
        >
          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by doctor name or specialization..."
          />

          <button
            type="submit"
            className="btn btn-primary"
          >
            Search
          </button>

          {search && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={async () => {
                setSearch("");

                try {
                  const data =
                    await getAvailablePhysicians();

                  setDoctors(data || []);
                } catch (err) {
                  setError(
                    err.message ||
                      "Unable to load doctors."
                  );
                }
              }}
            >
              Clear
            </button>
          )}
        </form>

      </section>

      {/* DOCTORS */}
      <section className="dashboard-section">

        <div className="section-header">
          <div>
            <h2>Available Doctors</h2>

            <p>
              Choose a doctor and decide whether
              they can access your health information.
            </p>
          </div>
        </div>

        {!doctors.length ? (
          <div className="empty-state">
            No doctors found.
          </div>
        ) : (
          <div className="card-grid">

            {doctors.map((doctor) => {
              const consent =
                getLatestConsent(
                  doctor.id
                );

              const granted =
                consent?.granted === true;

              const processing =
                actionDoctorId ===
                doctor.id;

              return (
                <div
                  className="data-card doctor-card"
                  key={doctor.id}
                >

                  <div className="doctor-card-header">

                    <div className="doctor-avatar">
                      {doctor.full_name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "D"}
                    </div>

                    <div>
                      <h2>
                        {doctor.full_name}
                      </h2>

                      <p>
                        {doctor.specialization ||
                          "General Doctor"}
                      </p>
                    </div>

                  </div>

                  {doctor.registration_number && (
                    <p className="doctor-registration">
                      <strong>
                        Registration:
                      </strong>{" "}
                      {doctor.registration_number}
                    </p>
                  )}

                  <div className="doctor-consent-status">

                    {granted ? (
                      <span className="consent-granted">
                        ✓ Consent Granted
                      </span>
                    ) : (
                      <span className="consent-not-granted">
                        No Access
                      </span>
                    )}

                  </div>

                  <div className="doctor-card-actions">

                    {granted ? (
                      <button
                        type="button"
                        className="btn btn-danger"
                        disabled={processing}
                        onClick={() =>
                          handleRevokeConsent(
                            doctor.id
                          )
                        }
                      >
                        {processing
                          ? "Removing..."
                          : "Remove Consent"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={processing}
                        onClick={() =>
                          handleGrantConsent(
                            doctor.id
                          )
                        }
                      >
                        {processing
                          ? "Granting..."
                          : "Give Consent"}
                      </button>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </section>

      {/* CONSENT INFORMATION */}
      <section className="consent-info-card">

        <h2>How Consent Works</h2>

        <p>
          You control which doctors can access
          your health information.
        </p>

        <ul>
          <li>
            Doctors cannot access your information
            without your consent.
          </li>

          <li>
            You can grant access to a specific doctor.
          </li>

          <li>
            You can remove access at any time.
          </li>

          <li>
            Removing consent prevents the doctor
            from accessing your authorized information.
          </li>
        </ul>

      </section>

    </div>
  );
}