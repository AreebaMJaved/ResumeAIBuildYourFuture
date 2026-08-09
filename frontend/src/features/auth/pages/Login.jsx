import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiLoader, FiArrowRight } from 'react-icons/fi';
import Toast from '../components/Toast';
import './AuthShared.css';
import './Login.css';
import { useAuth } from '../hooks/useAuth';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [toast, setToast] = useState(null);

  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <main className="auth-loading">
        <FiLoader className="spin-icon" size={28} />
        <h1>Loading...</h1>
      </main>
    );
  }

  const validate = () => {
    const e = {};
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Please enter a valid email address.';
    if (!form.password || form.password.length < 6)
      e.password = 'Password must be at least 6 characters.';
    return e;
  };

  const setField = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      await handleLogin({ email: form.email, password: form.password });
      navigate('/home');
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Login failed. Please check your credentials.',
      });
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  return (
    <div className="auth-page page-enter">

      <aside className="auth-left">
        <Link to="/" className="auth-logo" style={{ textDecoration: 'none' }}>
          Resume<span>AI</span>
        </Link>

        <div className="auth-left-body">
          <h2 className="auth-left-title">
            Welcome<br /><span>back.</span>
          </h2>
          <p className="auth-left-sub">
            Your dream career is one login away.<br />
            Pick up right where you left off.
          </p>

          <ul className="auth-features">
            <li>AI-generated resume bullet points</li>
            <li>Real-time ATS compatibility score</li>
            <li>50+ recruiter-approved templates</li>
            <li>One-click LinkedIn import</li>
          </ul>
        </div>

        <div className="auth-left-blob b1" />
        <div className="auth-left-blob b2" />
      </aside>

      <section className="auth-right">
        <div className="auth-form-wrap">
          <h1 className="auth-form-title">Sign In</h1>
          <p className="auth-form-sub">
            Don't have an account?{' '}
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              Create one free <FiArrowRight style={{ verticalAlign: 'middle' }} />
            </Link>
          </p>

          <form onSubmit={handleSubmit} noValidate>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className={`form-input${errors.email ? ' input-error' : ''}`}
                placeholder="alex@example.com"
                value={form.email}
                onChange={e => setField('email', e.target.value)}
                autoComplete="email"
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-password-wrap">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  className={`form-input${errors.password ? ' input-error' : ''}`}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setField('password', e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowPass(s => !s)}
                  aria-label="Toggle password visibility"
                >
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="forgot-row">
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="btn btn-pink btn-full" disabled={loading}>
              {loading ? (
                <>
                  <FiLoader className="spin-icon" /> Signing in...
                </>
              ) : (
                <>
                  Sign In <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <div className="divider"><span>or continue with</span></div>

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