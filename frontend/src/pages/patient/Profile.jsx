import { useEffect, useState } from "react";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";

import {
  getMyProfile,
  updateMyProfile,
} from "../../services/patientService";

import { usePatient } from "../../hooks/usePatient";

export default function Profile() {
  const {
    profile,
    setProfile,
  } = usePatient();

  const [form, setForm] = useState({
    full_name: "",
    dob: "",
    gender: "",
    phone: "",
  });

  const [loading, setLoading] = useState(
    !profile
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        dob: profile.dob || "",
        gender: profile.gender || "",
        phone: profile.phone || "",
      });

      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    if (!profile) {
      getMyProfile()
        .then((data) => {
          setProfile(data);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const updated =
        await updateMyProfile(form);

      setProfile(updated);

      setMessage(
        "Profile updated successfully."
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <Loader text="Loading profile..." />;
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p>
            Manage your personal information.
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

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
          />

          <Input
            label="Date of Birth"
            name="dob"
            type="date"
            value={form.dob || ""}
            onChange={handleChange}
          />

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

              <option value="Male">Male</option>
              <option value="Female">
                Female
              </option>
              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <Input
            label="Phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
          />

          <Button
            type="submit"
            loading={saving}
          >
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}