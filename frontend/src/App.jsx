// src/App.jsx
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './features/auth/auth.context';
import { InterviewProvider } from './features/interview/interview.context';
import { appsRoutes } from './apps.routes';
import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={appsRoutes} />
      </InterviewProvider>
    </AuthProvider>
  );
}