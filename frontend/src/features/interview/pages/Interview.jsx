// src/features/interview/pages/Interview.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useInterview } from "../hooks/useInterview";
import Toast from '../components/Toast';
import './Interview.css';

/* ── SVG Icons ─────────────────────────────────────────────── */
const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);
const ChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z" />
  </svg>
);
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

/* ── Nav config ─────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'technical',  label: 'Technical Questions',  icon: <CodeIcon /> },
  { id: 'behavioral', label: 'Behavioral Questions', icon: <ChatIcon /> },
  { id: 'roadmap',    label: 'Road Map',              icon: <MapIcon />  },
];

/* ── QuestionCard ────────────────────────────────────────────── */
function QuestionCard({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`iv-q-card${open ? ' iv-q-card--open' : ''}`}>
      <button className="iv-q-card__header" onClick={() => setOpen(o => !o)}>
        <span className="iv-q-card__index">Q{index + 1}</span>
        <p className="iv-q-card__question">{item.question}</p>
        <span className={`iv-q-card__chevron${open ? ' iv-q-card__chevron--open' : ''}`}>
          <ChevronIcon />
        </span>
      </button>

      {open && (
        <div className="iv-q-card__body">
          <div className="iv-q-card__section">
            <span className="iv-tag iv-tag--intention">Intention</span>
            <p>{item.intention}</p>
          </div>
          <div className="iv-q-card__section">
            <span className="iv-tag iv-tag--answer">Model Answer</span>
            <p>{item.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── RoadMapDay ──────────────────────────────────────────────── */
function RoadMapDay({ day }) {
  return (
    <div className="iv-roadmap-day">
      <div className="iv-roadmap-day__header">
        <span className="iv-roadmap-day__badge">Day {day.day}</span>
        <h3 className="iv-roadmap-day__focus">{day.focus}</h3>
      </div>
      <ul className="iv-roadmap-day__tasks">
        {day.tasks.map((task, i) => (
          <li key={i}>
            <span className="iv-roadmap-day__bullet" />
            {task}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────── */
export default function Interview() {
  const [activeNav, setActiveNav] = useState('technical');
  const [toast, setToast]         = useState(null);
  const { report, getReportById, loading, getInterviewReportPdf } = useInterview();
  const { interviewId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (interviewId) getReportById(interviewId);
  }, [interviewId]);

  const handleDownload = async () => {
      try {
    await getInterviewReportPdf(interviewId);

    setToast({
      message: "Interview report downloaded successfully!",
      icon: "📄",
    });
  } catch {
    setToast({
      message: "Download failed. Please try again.",
      icon: "❌",
    });
  }
  };

  /* ── Loading / Error ── */
  if (loading || !report) {
    return (
      <div className="iv-loading page-enter">
        <div className="iv-loading__spinner" />
        <h2 className="iv-loading__title">Loading your interview plan…</h2>
        <p className="iv-loading__sub">Fetching your personalised questions and roadmap.</p>
      </div>
    );
  }

  const scoreClass =
    report.matchScore >= 80 ? 'score--high' :
    report.matchScore >= 60 ? 'score--mid'  : 'score--low';

  return (
    <div className="iv-page page-enter">

      {/* ══ TOP NAV ══ */}
      <nav className="iv-topnav">
        <Link to="/" className="iv-logo">Resume<span>AI</span></Link>
        <div className="iv-topnav-center">
          <span className="iv-topnav-title">{report.title || 'Interview Plan'}</span>
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => navigate('/home')}
        >
          <ArrowLeftIcon /> Dashboard
        </button>
      </nav>

      {/* ══ LAYOUT ══ */}
      <div className="iv-layout">

        {/* ── Left Sidebar / Nav ── */}
        <aside className="iv-sidenav">
          <p className="iv-sidenav__label">Sections</p>

          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`iv-sidenav__item${activeNav === item.id ? ' iv-sidenav__item--active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="iv-sidenav__icon">{item.icon}</span>
              {item.label}
            </button>
          ))}

          <div className="iv-sidenav__spacer" />

          <button className="btn btn-pink iv-download-btn" onClick={handleDownload} disabled={loading}>
            <DownloadIcon />
            Download Interview Report
          </button>
        </aside>

        {/* vertical rule */}
        <div className="iv-vr" />

        {/* ── Main Content ── */}
        <main className="iv-content">

          {activeNav === 'technical' && (
            <section className="page-enter">
              <div className="iv-content-header">
                <h2>Technical Questions</h2>
                <span className="iv-count-badge">{report.technicalQuestions.length} questions</span>
              </div>
              <div className="iv-q-list">
                {report.technicalQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === 'behavioral' && (
            <section className="page-enter">
              <div className="iv-content-header">
                <h2>Behavioral Questions</h2>
                <span className="iv-count-badge">{report.behavioralQuestions.length} questions</span>
              </div>
              <div className="iv-q-list">
                {report.behavioralQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === 'roadmap' && (
            <section className="page-enter">
              <div className="iv-content-header">
                <h2>Preparation Road Map</h2>
                <span className="iv-count-badge">{report.preparationPlan.length}-day plan</span>
              </div>
              <div className="iv-roadmap-list">
                {report.preparationPlan.map(day => (
                  <RoadMapDay key={day.day} day={day} />
                ))}
              </div>
            </section>
          )}
        </main>

        {/* vertical rule */}
        <div className="iv-vr" />

        {/* ── Right Sidebar ── */}
        <aside className="iv-sidebar">

          {/* Match Score */}
          <div className="iv-score-card">
            <p className="iv-score-card__label">Match Score</p>
            <div className={`iv-score-ring ${scoreClass}`}>
              <span className="iv-score-ring__value">{report.matchScore}</span>
              <span className="iv-score-ring__pct">%</span>
            </div>
            <p className="iv-score-card__sub">
              {report.matchScore >= 80
                ? '🎯 Strong match for this role'
                : report.matchScore >= 60
                ? '👍 Decent match — keep improving'
                : '📈 Keep building your skills'}
            </p>
          </div>

          <div className="iv-sidebar-divider" />

          {/* Skill Gaps */}
          <div className="iv-skill-gaps">
            <p className="iv-skill-gaps__label">Skill Gaps</p>
            <div className="iv-skill-gaps__list">
              {report.skillGaps.map((gap, i) => (
                <span
                  key={i}
                  className={`iv-skill-tag iv-skill-tag--${gap.severity}`}
                >
                  {gap.skill}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>

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