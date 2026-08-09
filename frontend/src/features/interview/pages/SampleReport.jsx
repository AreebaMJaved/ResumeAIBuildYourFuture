// src/features/interview/pages/SampleReport.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiCode,
  FiMessageSquare,
  FiMap,
  FiChevronDown,
  FiArrowLeft,
  FiStar,
} from 'react-icons/fi';
import './Interview.css';

/* ── Nav config ─────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'technical', label: 'Technical Questions', icon: <FiCode /> },
  { id: 'behavioral', label: 'Behavioral Questions', icon: <FiMessageSquare /> },
  { id: 'roadmap', label: 'Road Map', icon: <FiMap /> },
];

/* ── Static sample data ────────────────────────────────────── */
const SAMPLE_REPORT = {
  title: 'Frontend Engineer at a Growing Startup',
  matchScore: 82,
  technicalQuestions: [
    {
      question: 'How would you optimize the performance of a React app with a long, frequently updating list?',
      intention: 'Checks understanding of rendering costs and whether you reach for the right tool instead of over-engineering.',
      answer: 'Use windowing or virtualization for long lists, memoize expensive components with React.memo and useMemo, and keep list item keys stable so React can reuse DOM nodes efficiently.',
    },
    {
      question: 'Explain the difference between useEffect and useLayoutEffect, and when you would choose one over the other.',
      intention: 'Tests depth of understanding of the React render cycle, not just familiarity with the hooks.',
      answer: 'useEffect runs after the browser paints, so it is suited for most side effects like data fetching. useLayoutEffect runs synchronously before paint, useful when you need to measure or mutate the DOM before the user sees it, such as fixing layout shifts.',
    },
    {
      question: 'How would you structure state management in a mid-sized app without over-relying on a global store?',
      intention: 'Looks for judgment about when local state, context, or a dedicated library is the right call.',
      answer: 'Keep state as local as possible by default, lift it only when multiple components genuinely need it, use context for rarely-changing values like theme or auth, and reach for a dedicated store only when state is shared widely and updates frequently.',
    },
  ],
  behavioralQuestions: [
    {
      question: 'Tell me about a time you disagreed with a technical decision made by your team.',
      intention: 'Evaluates communication style and whether you can push back constructively.',
      answer: 'Describe the specific disagreement, how you presented your reasoning with evidence rather than opinion, and how the team reached a resolution, whether that meant you changed your mind or the team did.',
    },
    {
      question: 'Describe a project where the requirements changed midway through.',
      intention: 'Tests adaptability and how you communicate scope changes to stakeholders.',
      answer: 'Explain how you reassessed priorities, communicated the impact of the change to the team or manager, and adjusted your plan without losing sight of the original goal.',
    },
  ],
  preparationPlan: [
    {
      day: 1,
      focus: 'Refresh core React and JavaScript fundamentals',
      tasks: [
        'Review closures, event loop, and array methods',
        'Rebuild a small component using hooks from memory',
        'Read through the React docs section on rendering behavior',
      ],
    },
    {
      day: 2,
      focus: 'Practice system design at a frontend scale',
      tasks: [
        'Sketch the architecture for a dashboard with real-time updates',
        'Practice explaining trade-offs out loud, not just on paper',
      ],
    },
    {
      day: 3,
      focus: 'Mock interview and behavioral prep',
      tasks: [
        'Run through the behavioral questions above with a friend',
        'Prepare two or three stories that show ownership and impact',
      ],
    },
  ],
  skillGaps: [
    { skill: 'TypeScript', severity: 'medium' },
    { skill: 'Testing (RTL/Jest)', severity: 'high' },
    { skill: 'System Design', severity: 'medium' },
    { skill: 'Accessibility', severity: 'low' },
  ],
};

/* ── QuestionCard ────────────────────────────────────────────── */
function QuestionCard({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`iv-q-card${open ? ' iv-q-card--open' : ''}`}>
      <button className="iv-q-card__header" onClick={() => setOpen((o) => !o)}>
        <span className="iv-q-card__index">Q{index + 1}</span>
        <p className="iv-q-card__question">{item.question}</p>
        <span className={`iv-q-card__chevron${open ? ' iv-q-card__chevron--open' : ''}`}>
          <FiChevronDown />
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
export default function SampleReport() {
  const [activeNav, setActiveNav] = useState('technical');
  const navigate = useNavigate();
  const report = SAMPLE_REPORT;

  const scoreClass =
    report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low';

  return (
    <div className="iv-page page-enter">

      {/* ══ SAMPLE BANNER ══ */}
      <div className="iv-sample-banner">
        <span>You are viewing a sample report. No account needed.</span>
        <Link to="/signup" className="btn btn-pink btn-sm" style={{ textDecoration: 'none' }}>
          Generate My Own Report
        </Link>
      </div>

      {/* ══ TOP NAV ══ */}
      <nav className="iv-topnav">
        <Link to="/" className="iv-logo" style={{ textDecoration: 'none' }}>
          Resume<span>AI</span>
        </Link>
        <div className="iv-topnav-center">
          <span className="iv-topnav-title">{report.title}</span>
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => navigate('/')}>
          <FiArrowLeft /> Back Home
        </button>
      </nav>

      {/* ══ LAYOUT ══ */}
      <div className="iv-layout">

        {/* ── Left Sidebar / Nav ── */}
        <aside className="iv-sidenav">
          <p className="iv-sidenav__label">Sections</p>

          {NAV_ITEMS.map((item) => (
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

          <Link to="/signup" className="btn btn-pink iv-download-btn" style={{ textDecoration: 'none' }}>
            <FiStar />
            Create Your Report
          </Link>
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
                <span className="iv-count-badge">{report.preparationPlan.length} day plan</span>
              </div>
              <div className="iv-roadmap-list">
                {report.preparationPlan.map((day) => (
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
            <p className="iv-score-card__sub">Strong match for this role</p>
          </div>

          <div className="iv-sidebar-divider" />

          {/* Skill Gaps */}
          <div className="iv-skill-gaps">
            <p className="iv-skill-gaps__label">Skill Gaps</p>
            <div className="iv-skill-gaps__list">
              {report.skillGaps.map((gap, i) => (
                <span key={i} className={`iv-skill-tag iv-skill-tag--${gap.severity}`}>
                  {gap.skill}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}