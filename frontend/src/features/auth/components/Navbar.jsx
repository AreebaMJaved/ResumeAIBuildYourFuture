// src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        Resume<span>AI</span>
      </Link>
      <div className="nav-actions">
        {pathname !== '/login' && (
          <Link to="/login" className="btn btn-outline">Log In</Link>
        )}
        {pathname !== '/signup' && (
          <Link to="/signup" className="btn btn-pink">Get Started Free</Link>
        )}
      </div>
    </nav>
  );
}