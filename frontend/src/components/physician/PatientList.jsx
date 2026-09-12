import { useState } from "react";

export default function PatientList({
  patients = [],
  selectedPatient,
  onSelect,
  loading = false,
}) {
  const [search, setSearch] =
    useState("");

  const filteredPatients =
    patients.filter((patient) => {
      const value =
        search
          .toLowerCase()
          .trim();

      if (!value) {
        return true;
      }

      return (
        String(
          patient.id
        ).includes(value) ||
        patient.full_name
          ?.toLowerCase()
          .includes(value)
      );
    });

  return (
    <div className="physician-patient-list">
      <div className="patient-list-header">
        <div>
          <h2>Patients</h2>

          <p>
            Patients who have authorized
            access to their clinical data.
          </p>
        </div>

        <span className="patient-count">
          {patients.length}
        </span>
      </div>

      <input
        type="search"
        value={search}
        onChange={(event) =>
          setSearch(
            event.target.value
          )
        }
        placeholder="Search patients..."
        className="patient-search"
      />

      {loading && (
        <div className="patient-list-loading">
          Loading patients...
        </div>
      )}

      {!loading &&
        filteredPatients.length === 0 && (
          <div className="empty-state">
            <h3>
              No authorized patients
            </h3>

            <p>
              Patients who grant physician
              access will appear here.
            </p>
          </div>
        )}

      <div className="patients-list">
        {filteredPatients.map(
          (patient) => {
            const isSelected =
              selectedPatient?.id ===
              patient.id;

            return (
              <button
                type="button"
                key={patient.id}
                className={`patient-list-item ${
                  isSelected
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  onSelect(patient)
                }
              >
                <div className="patient-avatar">
                  {getInitials(
                    patient.full_name
                  )}
                </div>

                <div className="patient-list-info">
                  <strong>
                    {patient.full_name ||
                      `Patient #${patient.id}`}
                  </strong>

                  <span>
                    Patient ID:{" "}
                    {patient.id}
                  </span>
                </div>

                <span className="patient-arrow">
                  →
                </span>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) =>
      word[0].toUpperCase()
    )
    .join("");
}