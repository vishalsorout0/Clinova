export default function PhysicianTable({
  physicians = [],
}) {
  if (!physicians.length) {
    return (
      <div className="empty-state">
        No physicians found.
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
            <th>Specialization</th>
            <th>Registration Number</th>
          </tr>
        </thead>

        <tbody>

          {physicians.map(
            (physician) => (

              <tr key={physician.id}>

                <td>
                  {physician.id}
                </td>

                <td>
                  {physician.full_name}
                </td>

                <td>
                  {physician.user_id}
                </td>

                <td>
                  {physician.specialization ||
                    "-"}
                </td>

                <td>
                  {physician.registration_number ||
                    "-"}
                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>
  );
}