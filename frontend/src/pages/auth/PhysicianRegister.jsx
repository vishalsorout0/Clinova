import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";

export default function PhysicianRegister() {
  const navigate = useNavigate();
  const { physicianRegister } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    specialization: "",
    registration_number: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        email: form.email,
        password: form.password,
        full_name: form.full_name,
        specialization: form.specialization || null,
        registration_number:
          form.registration_number || null,
      };

      const response =
        await physicianRegister(payload);

      setSuccess(
        response.message ||
          "Physician registered successfully."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(
        err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <div className="brand-mark">C</div>

          <h1>Physician Registration</h1>

          <p>
            Create your Clinova physician account
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Dr. Amit Sharma"
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="doctor@example.com"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
          />

          <Input
            label="Specialization"
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            placeholder="Cardiology"
          />

          <Input
            label="Registration Number"
            name="registration_number"
            value={form.registration_number}
            onChange={handleChange}
            placeholder="MCI-999999"
          />

          <Button
            type="submit"
            loading={loading}
            className="full-width"
          >
            Create Physician Account
          </Button>
        </form>

        <div className="auth-links">
          <p>
            Already registered?{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}