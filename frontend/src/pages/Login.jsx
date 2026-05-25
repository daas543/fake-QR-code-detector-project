import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import api, { getApiErrorMessage } from "../api/api.js";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(location.state?.message || "");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/api/auth/login", form);
      localStorage.setItem("token", response.data.token);
      navigate("/scanner");
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, "Login failed. Check your credentials and try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Welcome back</p>
        <h1>Login</h1>
        <p className="muted">Continue analyzing QR links before opening them.</p>

        {error && <div className="alert error">{error}</div>}

        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} />
        </label>

        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} />
        </label>

        <button className="primary-button full-width" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </section>
  );
}

export default Login;
