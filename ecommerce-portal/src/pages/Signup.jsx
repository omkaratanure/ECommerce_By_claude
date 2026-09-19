import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { signUp } from "../services/authClient";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    if (!form.password || form.password.length < 8) {
      next.password = "Password must be at least 8 characters";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitError("");
    setSubmitting(true);
    const { error } = await signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
    });
    if (error) {
      setSubmitError(error.message || "Could not create account.");
      setSubmitting(false);
      return;
    }
    navigate(location.state?.from?.pathname ?? "/");
  };

  return (
    <div className="page">
      <h1>Sign Up</h1>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <label>
          Full Name
          <input name="name" value={form.name} onChange={handleChange} />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </label>
        {submitError && <span className="field-error">{submitError}</span>}
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
