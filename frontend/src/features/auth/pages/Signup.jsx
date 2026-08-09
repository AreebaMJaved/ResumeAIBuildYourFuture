import { Signup as registerUser } from "../services/auth.api";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLoader, FiArrowRight } from "react-icons/fi";
import Toast from "../components/Toast";
import "./AuthShared.css";
import "./Signup.css";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

/* Password strength helper */
function getStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const STRENGTH_LABEL = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_CLASS = ["", "weak", "fair", "good", "strong"];

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const strength = getStrength(form.password);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};

    if (!form.username.trim()) e.username = "Username is required.";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "A valid email is required.";
    if (!form.password || form.password.length < 8)
      e.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirm)
      e.confirm = "Passwords do not match.";
    if (!agree)
      e.agree = "You must accept the Terms and Privacy Policy.";

    return e;
  };

  const setField = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
      });

      setToast({
        message: "Account created successfully",
      });

      setTimeout(() => {
        navigate("/home");
      }, 1000);

    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Signup failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  return (
    <div className="auth-page page-enter">
      {/* LEFT */}
      <aside className="auth-left">
        <Link to="/" className="auth-logo" style={{ textDecoration: 'none' }}>
          Resume<span>AI</span>
        </Link>

        <div className="auth-left-body">
          <h2 className="auth-left-title">
            Start Your <br />
            <span>Journey.</span>
          </h2>

          <p className="auth-left-sub">
            Create your free account and build a resume that opens doors, in just 5 minutes.
          </p>

          <ul className="auth-features">
            <li>Free forever, no credit card needed</li>
            <li>AI writes your resume in minutes</li>
            <li>Export to PDF, DOCX, or share a link</li>
            <li>Trusted by 2.4 million job seekers</li>
          </ul>
        </div>

        <div className="auth-left-blob b1" />
        <div className="auth-left-blob b2" />
      </aside>

      {/* RIGHT */}
      <section className="auth-right">
        <div className="auth-form-wrap">
          <h1 className="auth-form-title">Create Account</h1>

          <p className="auth-form-sub">
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'none' }}>
              Sign in <FiArrowRight style={{ verticalAlign: 'middle' }} />
            </Link>
          </p>

          <form onSubmit={handleSubmit} noValidate>

            {/* Username */}
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                className={`form-input${errors.username ? " input-error" : ""}`}
                placeholder="alex_johnson"
                value={form.username || ""}
                onChange={(e) => setField("username", e.target.value)}
                autoComplete="username"
              />
              {errors.username && <span className="form-error">{errors.username}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className={`form-input${errors.email ? " input-error" : ""}`}
                placeholder="alex@example.com"
                value={form.email || ""}
                onChange={(e) => setField("email", e.target.value)}
                autoComplete="email"
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>

              <div className="input-password-wrap">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  className={`form-input${errors.password ? " input-error" : ""}`}
                  placeholder="Min. 8 characters"
                  value={form.password || ""}
                  onChange={(e) => setField("password", e.target.value)}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowPass((s) => !s)}
                  aria-label="Toggle password visibility"
                >
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {form.password && (
                <div className="strength-wrap">
                  <div className="strength-bar">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`strength-seg ${
                          i <= strength ? `seg-${STRENGTH_CLASS[strength]}` : ""
                        }`}
                      />
                    ))}
                  </div>

                  <span className="strength-label">
                    Strength: <strong>{STRENGTH_LABEL[strength]}</strong>
                  </span>
                </div>
              )}

              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            {/* Confirm */}
            <div className="form-group">
              <label className="form-label" htmlFor="confirm">Confirm Password</label>

              <div className="input-password-wrap">
                <input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  className={`form-input${errors.confirm ? " input-error" : ""}`}
                  placeholder="Repeat your password"
                  value={form.confirm || ""}
                  onChange={(e) => setField("confirm", e.target.value)}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowConfirm((s) => !s)}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {errors.confirm && <span className="form-error">{errors.confirm}</span>}
            </div>

            {/* Terms */}
            <div className="terms-row">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => {
                  setAgree(e.target.checked);
                  setErrors((er) => ({ ...er, agree: "" }));
                }}
              />

              <label htmlFor="agree" className="terms-label">
                I agree to the <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>

            {errors.agree && <span className="form-error">{errors.agree}</span>}

            {/* Submit */}
            <button type="submit" className="btn btn-pink btn-full" disabled={loading}>
              {loading ? (
                <>
                  <FiLoader className="spin-icon" /> Creating account...
                </>
              ) : (
                "Create My Free Account"
              )}
            </button>
          </form>

          <div className="divider">
            <span>or sign up with</span>
          </div>

          <button className="social-btn" type="button" onClick={handleGoogleLogin}>
            <GoogleIcon />
            Continue with Google
          </button>
        </div>
      </section>

      {toast && (
        <Toast
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
