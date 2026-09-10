import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await login(
        form.email,
        form.password
      );

      const role = result.user?.role;

      const from = location.state?.from?.pathname;

      if (from && from !== "/login") {
        navigate(from, { replace: true });
        return;
      }

      if (role === "patient") {
        navigate("/patient/dashboard", {
          replace: true,
        });
      } else if (role === "physician") {
        navigate("/physician/dashboard", {
          replace: true,
        });
      } else if (role === "admin") {
        navigate("/admin/dashboard", {
          replace: true,
        });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(
        err.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-mark">C</div>

          <h1>Welcome to Clinova</h1>

          <p>
            Your AI-powered clinical history platform
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <Button
            type="submit"
            loading={loading}
            className="full-width"
          >
            Login
          </Button>
        </form>

        <div className="auth-links">
          <p>
            New patient?{" "}
            <Link to="/register/patient">
              Create patient account
            </Link>
          </p>

          <p>
            Physician?{" "}
            <Link to="/register/physician">
              Register as physician
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}