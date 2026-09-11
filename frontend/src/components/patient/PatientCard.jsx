export default function PatientCard({ profile }) {
  if (!profile) {
    return null;
  }

  return (
    <div className="patient-card">
      <div className="patient-avatar">
        {profile.full_name?.charAt(0)?.toUpperCase() || "P"}
      </div>

      <div>
        <h2>{profile.full_name}</h2>

        <p>
          Patient ID: #{profile.id}
        </p>

        {profile.gender && (
          <span>{profile.gender}</span>
        )}

        {profile.phone && (
          <span className="patient-phone">
            {profile.phone}
          </span>
        )}
      </div>
    </div>
  );
}