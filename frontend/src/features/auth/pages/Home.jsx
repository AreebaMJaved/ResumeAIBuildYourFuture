import React from 'react';
import { Link } from 'react-router-dom';
import { FiCpu, FiTarget, FiZap, FiBarChart2, FiFileText, FiLock } from 'react-icons/fi';
import ResumeCard from '../components/ResumeCard';
import './Home.css';

const FEATURES = [
  {
    icon: <FiCpu />,
    title: 'AI Interview Generator',
    desc: 'Generates real interview questions based on your resume and job description.',
  },
  {
    icon: <FiTarget />,
    title: 'Job Match Analysis',
    desc: 'Compares your profile with job requirements and calculates match score.',
  },
  {
    icon: <FiZap />,
    title: 'AI Answer Suggestions',
    desc: 'Provides ideal answers for technical and behavioral questions.',
  },
  {
    icon: <FiBarChart2 />,
    title: 'Skill Gap Detection',
    desc: 'Identifies missing skills you need to improve before interviews.',
  },
  {
    icon: <FiFileText />,
    title: 'Interview PDF Report',
    desc: 'Download a structured AI generated interview preparation report.',
  },
  {
    icon: <FiLock />,
    title: 'Privacy First',
    desc: 'Your resume and data are never stored or shared.',
  },
];

export default function Home() {
  return (
    <main className="home page-enter">

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">

          <div className="hero-badge">
            <FiCpu /> AI Interview Engine
          </div>

          <h1 className="hero-title">
            Turn Your Resume Into<br />
            <span className="accent-teal">Interview Questions</span><br />
            <span className="accent-pink">Before You Apply</span>
          </h1>

          <p className="hero-sub">
            Upload your resume and job description. Our AI generates real interview questions,
            ideal answers, skill gaps, and a complete preparation plan, just like a real recruiter.
          </p>

          <div className="hero-cta">
            <Link to="/signup" className="btn btn-pink" style={{ textDecoration: 'none' }}>
              Generate Interview Report
            </Link>
            <Link to="/sample-report" className="btn btn-outline" style={{ textDecoration: 'none' }}>
              View Sample Report
            </Link>
          </div>

        </div>

        <div className="hero-visual">
          <ResumeCard />
        </div>
      </section>

      {/* QUOTE */}
      <section className="quote-section">
        <blockquote className="quote-text">
          "Don't just prepare for jobs. Prepare for the{' '}
          <em>exact interview they will ask you</em>."
        </blockquote>
        <cite className="quote-author">InterviewIQ AI</cite>

        <div className="quote-dots">
          <div className="dot active" />
          <div className="dot" />
          <div className="dot" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="section-tag">What the AI does</div>
        <h2 className="section-title">Know your interview before it happens</h2>
        <p className="section-sub">
          We simulate real recruiter thinking using your resume and job description.
        </p>

        <div className="features-grid">
          {FEATURES.map(({ icon, title, desc }) => (
            <div className="feature-card" key={title}>
              <div className="feature-icon">{icon}</div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="cta-strip">
        <h2>Ready to simulate your interview?</h2>
        <p>
          Upload your resume and job description to get a full AI interview breakdown.
        </p>

        <Link to="/signup" className="btn btn-pink" style={{ textDecoration: 'none' }}>
          Start Free Analysis
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        © 2026 <span>InterviewIQ AI</span>. Built for smarter job preparation.
      </footer>
    </main>
  );
}