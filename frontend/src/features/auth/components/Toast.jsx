// src/components/Toast.jsx
import React, { useEffect } from 'react';
import './Toast.css';

export default function Toast({ message, icon = '✓', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="toast">
      <span className="toast-icon">{icon}</span>
      <span>{message}</span>
    </div>
  );
}