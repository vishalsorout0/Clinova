import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import { getMyProfile, updateMyProfile } from "../../services/patientService";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    setError("");

    try {
      const data = await getMyProfile();

      setProfile(data);

      setForm({
        full_name: data.full_name || "",
        date_of_birth:
          data.date_of_birth ||
          data.dob ||
          "",
        gender: data.gender || "",
        phone: data.phone || "",
      });
    } catch (err) {
      setError(
        err.message ||
          "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const updated = await updateMyProfile({
        full_name: form.full_name,
        date_of_birth:
          form.date_of_birth || null,
        gender: form.gender || null,
        phone: form.phone || null,
      });

      setProfile(updated);

      setForm({
        full_name: updated.full_name || "",
        date_of_birth:
          updated.date_of_birth ||
          updated.dob ||
          "",
        gender: updated.gender || "",
        phone: updated.phone || "",
      });

      setMessage(
        "Profile updated successfully."
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Loader text="Loading your profile..." />
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p>
            View and update your personal information.
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

      <section className="dashboard-section">
        <div className="data-card profile-edit-card">
          <div className="section-header">
            <div>
              <h2>Edit Profile</h2>
              <p>
                Keep your personal information up to date.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="profile-form"
          >
            <div className="form-group">
              <label htmlFor="full_name">
                Full Name
              </label>

              <input
                id="full_name"
                name="full_name"
                type="text"
                value={form.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date_of_birth">
                Date of Birth
              </label>

              <input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={form.date_of_birth}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">
                Gender
              </label>

              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">
                  Select gender
                </option>
                <option value="Male">
                  Male
                </option>
                <option value="Female">
                  Female
                </option>
                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            {profile?.email && (
              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  value={profile.email}
                  disabled
                />

                <small>
                  Email cannot be changed here.
                </small>
              </div>
            )}

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

