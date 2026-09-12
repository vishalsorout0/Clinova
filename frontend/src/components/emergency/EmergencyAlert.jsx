export default function EmergencyAlert({
  result,
}) {
  if (!result) {
    return null;
  }

  const data =
    result.result || result;

  if (!data.has_red_flags) {
    return null;
  }

  return (
    <div className="emergency-alert">
      <div className="emergency-alert-icon">
        🚨
      </div>

      <div>
        <h3>
          Urgent Attention Required
        </h3>

        <p>
          The consultation contains
          potentially concerning symptoms.
        </p>

        {data.priority && (
          <strong>
            Priority:{" "}
            {data.priority}
          </strong>
        )}

        {Array.isArray(
          data.red_flags
        ) &&
          data.red_flags.length > 0 && (
            <ul>
              {data.red_flags.map(
                (flag, index) => (
                  <li key={index}>
                    {flag}
                  </li>
                )
              )}
            </ul>
          )}
      </div>
    </div>
  );
}