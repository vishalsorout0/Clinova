# Sahayak — Patient Case-Taking Software

## Project

Smart India Hackathon (SIH) 2026 — Frontend submission.

## Problem Statement

**26047** — Ministry of Ayush — *Patient Case-Taking Software* (MedTech / BioTech / HealthTech)

This repository contains the complete **frontend** for an AI-assisted, kiosk-first
pre-consultation platform. Patients share their health story — by voice, touch or
text, in English or Hindi — before meeting a physician. The AI assistant never
diagnoses; it organizes information into a structured, physician-verifiable
summary.

## Technology Stack

| Layer | Choice |
|---|---|
| Framework | React 18 (JavaScript, no TypeScript) |
| Build tool | Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Icons | Lucide React |
| HTTP | Axios (`src/services/api.js`) |
| Backend-ready | Supabase JS client + REST architecture for a future FastAPI backend |
| State | React Context + hooks (no Redux) |

## Features

- ABHA-ready authentication (number/QR + OTP), with guest fallback
- Multilingual UI (English, Hindi) with an i18n architecture ready for more
  Indian languages
- Accessibility: large text, high contrast, voice guidance, text-to-speech,
  speech-to-text, reduced motion, keyboard navigation, and a sign-language
  assistance placeholder
- AI conversational history-taking (voice + touch), with adaptive,
  backend-driven questions and red-flag / priority-attention detection
- Document upload & scan-to-OCR pipeline with a staged processing animation
- Medical timeline, medication extraction, and lab-value flags
  (normal / potentially abnormal / undetermined — never a diagnosis)
- AI-generated clinical summary, clearly labelled "Requires physician
  verification"
- Physician dashboard, patient overview (tabs), and a full verification UI
  (edit / mark verified / accept / reject) with "Modified by physician" tags
- Admin dashboard: stats, user management, session management, audit logs
- Role-based routing (`patient` / `physician` / `admin`), protected routes,
  and a session-expiry warning modal
- AYUSH consultation mode placeholder
- Fully functional in **mock mode** — the entire app is demonstrable with
  zero backend

## Installation

```bash
npm install
```

## Run (development)

```bash
npm run dev
```

## Build (production)

```bash
npm run build
npm run preview   # optional, serves the production build locally
```

## Environment Variables

Create/edit `.env` in the project root:

```env
VITE_API_BASE_URL=       # Base URL of the FastAPI backend (leave blank for mock mode)
VITE_SUPABASE_URL=       # Supabase project URL
VITE_SUPABASE_ANON_KEY=  # Supabase public anon key (safe for frontend use)
```

Never put `SUPABASE_SERVICE_ROLE_KEY` or any secret key in this project —
only the public anon key belongs on the frontend.

## Mock Mode

If `VITE_API_BASE_URL` is not set, every service in `src/services/` (auth,
patient, conversation, documents, summary, physician, admin) automatically
falls back to realistic mock data with simulated network latency. This means
the full patient → physician → admin journey can be demoed end-to-end with
no backend running. Demo OTP for ABHA login: **123456**.

## Backend Integration

Each file in `src/services/` is structured as:

```js
if (isMockMode) {
  // realistic mock response
} else {
  // real axios call to VITE_API_BASE_URL
}
```

To connect the real FastAPI backend, set `VITE_API_BASE_URL` — no component
code needs to change, since UI components only ever talk to the service
layer, never to `axios`/`fetch` directly.

## Project Structure

The directory layout under `src/` (components, pages, layouts, routes,
context, services, hooks, utils, i18n) mirrors the mandatory architecture
defined for this hackathon build. Notably:

- Reusable Framer Motion variants live in `src/utils/helpers.js` (no
  separate `animations.js`).
- Sign-language assistance is a placeholder toggle inside
  `src/components/accessibility/AccessibilityControls.jsx`, ready to be
  wired to real assets in `public/sign-language/`.
- The Admin `users` / `sessions` / `audit-logs` routes are served by the
  single `src/pages/admin/AdminDashboard.jsx` page component (switching on
  the current route), to keep to the fixed two-file admin pages structure.

## Safety & Language Notes

This frontend deliberately avoids diagnostic or prescriptive language.
AI-derived content is always labelled "AI-assisted" or "AI-generated —
requires physician verification." Lab values are shown as
normal / potentially abnormal / undetermined, never as a diagnosis. Red-flag
symptoms surface a "Priority medical attention required" screen, not a
simulated diagnosis.
