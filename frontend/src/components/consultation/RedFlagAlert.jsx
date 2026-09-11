export default function RedFlagAlert({
  redFlags,
}) {
  if (!redFlags) {
    return null;
  }

  const result =
    redFlags.result ||
    redFlags;

  const hasRedFlags =
    result.has_red_flags === true;

  if (!hasRedFlags) {
    return null;
  }

  const flags =
    result.red_flags || [];

  return (
    <div className="red-flag-alert">
      <div className="red-flag-icon">
        !
      </div>

      <div>
        <h3>
          Important Health Alert
        </h3>

        <p>
          Clinova detected information that
          may require prompt medical attention.
        </p>

        {flags.length > 0 && (
          <ul>
            {flags.map(
              (flag, index) => (
                <li key={index}>
                  {flag}
                </li>
              )
            )}
          </ul>
        )}

        {result.priority && (
          <strong>
            Priority:{" "}
            {result.priority}
          </strong>
        )}

        <p className="red-flag-disclaimer">
          This alert is not a diagnosis.
          If symptoms are severe or worsening,
          seek appropriate medical care.
        </p>
      </div>
    </div>
  );
}