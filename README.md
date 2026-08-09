# ResumeAIBuildYourFuture

**AI Interview Engine** — Turn your resume into interview questions before you apply.

ResumeAI analyzes a user's resume (or self-description) alongside a target job description and generates a personalized interview preparation package: technical questions, behavioral questions, a skill-gap analysis, a match score, and a day-by-day preparation roadmap.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Known Limitations / Roadmap](#known-limitations--roadmap)

---

## Features

- **AI Interview Report Generation** — upload a resume (PDF/DOCX) or provide a self-description alongside a job description to generate a tailored interview plan.
- **Technical & Behavioral Question Banks** — each question includes the interviewer's underlying intention and a model answer.
- **Match Score** — a percentage score indicating how well a profile fits the target role.
- **Skill Gap Detection** — highlights missing or weak skills, tagged by severity.
- **Preparation Roadmap** — a multi-day study plan with daily focus areas and tasks.
- **Resume PDF Export** — download a generated resume/report as a PDF.
- **Sample Report** — a public, no-login-required page (`/sample-report`) so visitors can preview the product before signing up.
- **Authentication**
  - Email + password registration and login (JWT, hashed with bcrypt)
  - Google OAuth 2.0 ("Continue with Google") via Passport.js
  - Persistent sessions via secure, httpOnly cookies
  - Token blacklisting on logout

---

## Tech Stack

**Frontend**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

| Technology | Purpose |
|---|---|
| **React** (Vite) | UI library and build tooling |
| **React Router** (`createBrowserRouter`) | Client-side routing |
| **Axios** | HTTP client, configured with `withCredentials` for cookie-based auth |
| **react-icons** (Feather set) | UI iconography |

**Backend**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![Passport](https://img.shields.io/badge/Passport.js-34E27A?style=for-the-badge&logo=passport&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

| Technology | Purpose |
|---|---|
| **Node.js / Express** | Server runtime and routing |
| **MongoDB + Mongoose** | Database and schema modeling |
| **Passport.js** (`passport-google-oauth20`) | Google OAuth 2.0 strategy |
| **jsonwebtoken** | Issuing and verifying session tokens |
| **bcrypt** | Password hashing |
| **express-session** | Required by Passport's OAuth handshake |
| **cookie-parser, cors** | Cookie parsing and cross-origin request handling |

---

## Project Structure

```
frontend/
├── src/
│   ├── apps.routes.js                     # route definitions (createBrowserRouter)
│   ├── pages/
│   │   ├── Home.jsx                       # public landing page
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   └── features/
│       ├── auth/
│       │   ├── auth.context.js            # AuthContext + AuthProvider (session hydration)
│       │   ├── hooks/useAuth.js
│       │   └── services/auth.api.js       # axios instance, Login/Signup/Logout/Getme
│       └── interview/
│           ├── pages/
│           │   ├── Home.jsx               # post-login dashboard
│           │   ├── Interview.jsx          # generated report view
│           │   └── SampleReport.jsx       # public static demo report
│           ├── hooks/useInterview.js
│           └── services/interview.api.js

backend/
├── app.js                                 # Express app, middleware wiring
├── config/
│   └── passport.js                        # Google OAuth strategy
├── controllers/
│   ├── auth.controller.js
│   └── interview.controller.js
├── middlewares/
│   ├── auth.middlewares.js                # JWT cookie verification
│   └── file.middleware.js                 # resume upload handling
├── models/
│   ├── users.model.js
│   └── tokenBlackList.model.js
└── routes/
    ├── auth.routes.js
    └── interview.routes.js
```

---

## Authentication

ResumeAI supports two sign-in methods that both resolve to the **same session mechanism**: a signed JWT stored in an httpOnly cookie named `token`.

### 1. Email & Password

1. `POST /api/auth/register` — hashes the password with bcrypt and creates the user.
2. `POST /api/auth/login` — verifies credentials, issues a JWT, sets it as an httpOnly cookie.
3. Every protected route uses `authMiddleware.authUser`, which reads `req.cookies.token`, checks it against a blacklist, and verifies it with `JWT_SECRET_KEY`.

### 2. Google OAuth 2.0

1. `GET /api/auth/google` — redirects to Google's consent screen (`passport.authenticate("google", { scope: ["profile", "email"] })`).
2. `GET /api/auth/google/callback` — Passport verifies the Google profile; if no user exists with that email, one is created automatically (`authProvider: "google"`, no password). Login and signup share this route — a first-time Google sign-in **is** the signup.
3. The callback controller issues the same kind of JWT as the local login flow and sets the `token` cookie, then redirects to the frontend dashboard.

> **Note:** Accounts created via Google do not have a usable password. Attempting to log in with email + password on a Google-linked account should be rejected with a clear message directing the user back to "Continue with Google," rather than a generic "invalid credentials" error.

### Session Hydration (Frontend)

Because OAuth redirects are full page loads (not AJAX), the frontend cannot rely on a login response to populate user state. Instead, `AuthProvider` calls `GET /api/auth/get-me` once on mount to hydrate `user` from the `token` cookie, covering both login methods and page refreshes.

### Logout

`GET /api/auth/logout` blacklists the current token (so it can't be reused even if it hasn't expired) and clears the cookie.

---

## Environment Variables

Create a `.env` file in the backend root:

```env
PORT=5000
MONGODB_URI=<your MongoDB connection string>
JWT_SECRET_KEY=<a long, random secret>
SESSION_SECRET=<a long, random secret>

GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
```

Google Cloud Console → OAuth Client → **Authorized redirect URIs** must include:
```
http://localhost:5000/api/auth/google/callback
```

---

## Getting Started

### Backend
```bash
cd backend
npm install
npm run dev        # requires nodemon; restart manually if using plain `node app.js`
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`, the backend on `http://localhost:5000`. CORS is configured for this exact origin pairing with `credentials: true`.

---

## API Reference

| Method | Endpoint                              | Access  | Description                              |
|--------|----------------------------------------|---------|-------------------------------------------|
| POST   | `/api/auth/register`                  | Public  | Create a new local account                |
| POST   | `/api/auth/login`                     | Public  | Log in with email + password              |
| GET    | `/api/auth/logout`                    | Private | Blacklist token, clear cookie             |
| GET    | `/api/auth/get-me`                    | Private | Get the current authenticated user        |
| GET    | `/api/auth/google`                    | Public  | Begin Google OAuth flow                   |
| GET    | `/api/auth/google/callback`           | Public  | Google OAuth redirect target              |
| POST   | `/api/interview/`                     | Private | Generate a new interview report           |
| GET    | `/api/interview/`                     | Private | List all reports for the logged-in user   |
| GET    | `/api/interview/report/:interviewId`  | Private | Get a single report by ID                 |
| POST   | `/api/interview/resume/pdf/:interviewReportId` | Private | Generate/download a resume PDF |

---

## Known Limitations / Roadmap

- No email verification on signup — any email address can currently be used to register.
- No "forgot password" flow implemented yet (link present in UI, not wired up).
- Google-linked accounts store no password; login form does not yet distinguish this case with a dedicated error message.
- No rate limiting on auth endpoints.
