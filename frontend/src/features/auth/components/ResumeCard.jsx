// src/components/ResumeCard.jsx
import React from 'react';
import './ResumeCard.css';

const skills = [
  ['Figma',       92],
  ['React',       78],
  ['UX Research', 85],
  ['Prototyping', 88],
];

const experience = [
  { title: 'Lead Designer',  sub: 'Spotify · 2021–Now' },
  { title: 'UI Designer',    sub: 'Airbnb  · 2019–21'  },
];



const ResumeCard = () => {
  return (
    <div className="rc-wrapper">
      {/* ambient blobs */}
      <div className="blob blob-teal" />
      <div className="blob blob-pink" />

      <div className="resume-card">
        <span className="ai-chip">✦ AI Generated</span>

        {/* Header */}
        <div className="rc-header">
          <div className="rc-avatar">👤</div>
          <div className="rc-name">Alex Johnson</div>
          <div className="rc-role">Senior Product Designer · 7 yrs exp</div>
        </div>

        {/* Body */}
        <div className="rc-body">
          <div className="rc-label">Skills</div>
          {skills.map(([name, val]) => (
            <div className="rc-bar-row" key={name}>
              <span className="rc-bar-name">{name}</span>
              <div className="rc-bar-bg">
                <div className="rc-bar-fill" style={{ width: `${val}%` }} />
              </div>
            </div>
          ))}

          <div className="rc-label" style={{ marginTop: 16 }}>Experience</div>
          {experience.map(({ title, sub }) => (
            <div className="rc-exp" key={title}>
              <div className="rc-exp-title">{title}</div>
              <div className="rc-exp-sub">{sub}</div>
            </div>
          ))}

          <div className="rc-label" style={{ marginTop: 16 }}>Education</div>
          <div className="rc-exp">
            <div className="rc-exp-title">B.Sc. Human-Computer Interaction</div>
            <div className="rc-exp-sub">MIT · 2015–2019</div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ResumeCard;