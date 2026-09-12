export default function EmergencyButton({
  onClick,
  loading = false,
}) {
  return (
    <button
      type="button"
      className="emergency-button"
      onClick={onClick}
      disabled={loading}
    >
      {loading
        ? "Checking..."
        : "🚨 Emergency"}
    </button>
  );
}