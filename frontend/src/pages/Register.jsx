import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api, { getApiErrorMessage } from "../api/api.js";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
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

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Please enter your name, email, and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/api/auth/register", form);
      localStorage.setItem("token", response.data.token);
      navigate("/scanner");
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, "Registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Create account</p>
        <h1>Register</h1>
        <p className="muted">Save scans and track suspicious QR links over time.</p>

        {error && <div className="alert error">{error}</div>}

        <label>
          Name
          <input name="name" type="text" value={form.name} onChange={handleChange} />
        </label>

        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} />
        </label>

        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} />
        </label>

        <button className="primary-button full-width" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </section>
  );
}

export default Register;
