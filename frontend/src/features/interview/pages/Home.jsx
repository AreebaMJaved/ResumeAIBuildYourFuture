// src/pages/Home.jsx  — Post-login Dashboard (Interview Plan Generator)
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInterview } from '../hooks/useInterview.js';
import Toast from '../components/Toast';
import './Home.css';
import {useAuth} from '../../auth/hooks/useAuth.js'
/* ── small icon components ── */
const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);

export default function Home() {
  const { loading, generateReport, reports } = useInterview();
  const [jobDescription, setJobDescription]   = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [fileName, setFileName]               = useState('');
  const [toast, setToast]                     = useState(null);
  const resumeInputRef = useRef();
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  /* ── handlers ── */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : '');
  };
  
const onLogout = async () => {
  await handleLogout();
  navigate('/');
};
  const handleGenerateReport = async () => {
    if (!jobDescription.trim()) {
      setToast({ message: 'Please add a job description first.', icon: '⚠️' });
      return;
    }
    if (!resumeInputRef.current.files[0] && !selfDescription.trim()) {
      setToast({ message: 'Please upload a resume or add a self-description.', icon: '⚠️' });
      return;
    }
    try {
      const resumeFile = resumeInputRef.current.files[0];
      const data = await generateReport({ jobDescription, selfDescription, resumeFile });
      navigate(`/interview/${data._id}`);
    } catch {
      setToast({ message: 'Something went wrong. Please try again.', icon: '❌' });
    }
  };

  /* ── loading screen ── */
  if (loading) {
    return (
      <div className="dash-loading page-enter">
        <div className="dash-loading__spinner" />
        <h2 className="dash-loading__title">Crafting Your Interview Plan</h2>
        <p className="dash-loading__sub">Our AI is analysing the job requirements and your profile…</p>
      </div>
    );
  }

  return (
    <div className="dashboard page-enter">

      {/* ══ TOP NAV ══ */}
      <nav className="dash-nav">
        <Link to="/" className="dash-logo">Resume<span>AI</span></Link>
        <div className="dash-nav-right">
          <span className="dash-nav-badge">✦ AI-Powered</span>
          <button className="btn btn-outline btn-sm " onClick={onLogout}>Log Out</button>
        </div>
      </nav>

      {/* ══ PAGE HEADER ══ */}
      <header className="dash-header">
        <div className="dash-header__inner">
          <div className="dash-badge">✦ Interview Strategy Generator</div>
          <h1 className="dash-title">
            Create Your Custom<br />
            <span className="accent-teal">Interview Plan</span>
          </h1>
          <p className="dash-sub">
            Let our AI analyse the job requirements and your unique profile
            to build a winning strategy — in about 30 seconds.
          </p>
        </div>
      </header>

      {/* ══ MAIN CARD ══ */}
      <main className="dash-main">
        <div className="plan-card">

          {/* card header strip */}
          <div className="plan-card__header">
            <div className="plan-card__header-left">
              <StarIcon />
              <span>AI-Powered Strategy Generation</span>
            </div>
            <span className="plan-card__eta">⏱ Approx 30 seconds</span>
          </div>

          <div className="plan-card__body">

            {/* ── LEFT PANEL: Job Description ── */}
            <div className="input-panel input-panel--left">
              <div className="input-panel__label">
                <span className="panel-icon panel-icon--teal"><BriefcaseIcon /></span>
                <h2>Target Job Description</h2>
                <span className="badge badge--required">Required</span>
              </div>

              <textarea
                className="panel-textarea"
                placeholder={`Paste the full job description here…\ne.g. "Senior Frontend Engineer at Google requires React, TypeScript, and system design…"`}
                maxLength={5000}
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
              />

              <div className="char-counter">
                <span className={jobDescription.length > 4500 ? 'char-warn' : ''}>
                  {jobDescription.length}
                </span> / 5000 chars
              </div>
            </div>

            {/* vertical divider */}
            <div className="panel-divider" />

            {/* ── RIGHT PANEL: Profile ── */}
            <div className="input-panel input-panel--right">
              <div className="input-panel__label">
                <span className="panel-icon panel-icon--pink"><UserIcon /></span>
                <h2>Your Profile</h2>
              </div>

              {/* Upload Resume */}
              <label className="section-label">
                Upload Resume
                <span className="badge badge--best">Best Results</span>
              </label>

              <label
                className={`dropzone${fileName ? ' dropzone--filled' : ''}`}
                htmlFor="resume-upload"
              >
                <span className="dropzone__icon">
                  {fileName ? '📄' : <UploadIcon />}
                </span>
                {fileName
                  ? <p className="dropzone__filename">{fileName}</p>
                  : <>
                      <p className="dropzone__title">Click to upload or drag &amp; drop</p>
                      <p className="dropzone__sub">PDF or DOCX · Max 5 MB</p>
                    </>
                }
                <input
                  ref={resumeInputRef}
                  hidden
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                />
              </label>

              {/* OR divider */}
              <div className="or-divider"><span>OR</span></div>

              {/* Self-description */}
              <label className="section-label" htmlFor="self-desc">
                Quick Self-Description
              </label>
              <textarea
                id="self-desc"
                className="panel-textarea panel-textarea--short"
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy…"
                value={selfDescription}
                onChange={e => setSelfDescription(e.target.value)}
              />

              {/* Info box */}
              <div className="info-box">
                <span className="info-box__icon">ℹ️</span>
                <p>Either a <strong>Resume</strong> or a <strong>Self-Description</strong> is required for a personalised plan.</p>
              </div>
            </div>
          </div>

          {/* card footer */}
          <div className="plan-card__footer">
            <button
              className="btn btn-pink generate-btn"
              onClick={handleGenerateReport}
              disabled={loading}
            >
              <StarIcon />
              Generate My Interview Strategy
            </button>
          </div>
        </div>

        {/* ══ RECENT REPORTS ══ */}
        {reports && reports.length > 0 && (
          <section className="recent-section">
            <div className="recent-section__header">
              <div className="section-tag">Your History</div>
              <h2 className="section-title">Recent Interview Plans</h2>
            </div>

            <div className="reports-grid">
              {reports.map(report => (
                <div
                  key={report._id}
                  className="report-card"
                  onClick={() => navigate(`/interview/${report._id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && navigate(`/interview/${report._id}`)}
                >
                  <div className="report-card__top">
                    <h3 className="report-card__title">{report.title || 'Untitled Position'}</h3>
                    <span className={`score-chip ${
                      report.matchScore >= 80 ? 'score--high'
                      : report.matchScore >= 60 ? 'score--mid'
                      : 'score--low'
                    }`}>
                      {report.matchScore}% match
                    </span>
                  </div>
                  <p className="report-card__date">
                    Generated on {new Date(report.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </p>
                  <div className="report-card__arrow">View Plan →</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ══ FOOTER ══ */}
      <footer className="dash-footer">
        <span>© 2025 <strong>ResumeAI</strong>. All rights reserved.</span>
        <div className="dash-footer__links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Help Center</a>
        </div>
      </footer>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          icon={toast.icon}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}