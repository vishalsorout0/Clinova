export default function PatientTable({
  patients = [],
}) {
  if (!patients.length) {
    return (
      <div className="empty-state">
        No patients found.
      </div>
    );
  }

  return (
    <div className="admin-table-wrapper">

      <table className="admin-table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>User ID</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Date of Birth</th>
          </tr>
        </thead>

        <tbody>

          {patients.map((patient) => (

            <tr key={patient.id}>

              <td>
                {patient.id}
              </td>

              <td>
                {patient.full_name}
              </td>

              <td>
                {patient.user_id}
              </td>

              <td>
                {patient.gender || "-"}
              </td>

              <td>
                {patient.phone || "-"}
              </td>

              <td>
                {formatDateOnly(
                  patient.date_of_birth
                )}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}


function formatDateOnly(date) {
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