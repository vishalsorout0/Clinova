# Clinova Frontend

Clinova is an AI-powered clinical history platform.

## Tech Stack

- React
- Vite
- React Router
- FastAPI backend

## Backend

The frontend expects the backend to run at:

http://127.0.0.1:8000

API base:

http://127.0.0.1:8000/api

## Run Frontend

Install dependencies:

npm install

Start development server:

npm run dev

Frontend:

http://localhost:5173

## Authentication

Patient registration:

POST /api/auth/register/patient

Physician registration:

POST /api/auth/register/physician

Login:

POST /api/auth/login

Login uses OAuth2 form-urlencoded credentials.

The JWT token is stored in localStorage and automatically attached as:

Authorization: Bearer <token>