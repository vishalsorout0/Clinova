export default function EmergencyAlert({
  result,
}) {
  if (!result) {
    return null;
  }

  const hasEmergency =
    result.has_emergency === true ||
    result.status === "emergency";

  if (!hasEmergency) {
    return null;
  }

  const alerts = result.alerts || [];

  return (
    <div className="emergency-alert">
      <div className="emergency-alert-icon">
        🚨
      </div>

      <div className="emergency-alert-content">
        <h3>
          Urgent Attention Required
        </h3>

        <p>
          Potentially concerning symptoms
          were detected during your consultation.
        </p>

        {result.priority && (
          <p>
            <strong>
              Priority: {result.priority}
            </strong>
          </p>
        )}

        {alerts.length > 0 && (
          <ul>
            {alerts.map(
              (alert, index) => (
                <li key={index}>
                  {alert}
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </div>
  );
}