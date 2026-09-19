import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { signIn } from "../services/authClient";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Email is required";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitError("");
    setSubmitting(true);
    const { error } = await signIn.email({ email: form.email, password: form.password });
    if (error) {
      setSubmitError(error.message || "Invalid email or password.");
      setSubmitting(false);
      return;
    }
    navigate(location.state?.from?.pathname ?? "/");
  };

  return (
    <div className="page">
      <h1>Log In</h1>
      <form className="checkout-form" onSubmit={handleSubmit}>
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
          {submitting ? "Logging in..." : "Log In"}
        </button>
      </form>
      <p>
        Don&apos;t have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
