# Clinova 

---

### AI-Powered Patient Case-Taking & Clinical History Platform

Clinova is an AI-powered clinical history platform that helps patients record their symptoms and medical history, upload previous medical documents, and generate a structured clinical summary for doctors.

The main goal is to reduce repetitive history-taking and manual document review while keeping the doctor in control of the final clinical information.

---

## 🚀 Features

### 👤 Patient Module

- Patient registration and login
- JWT-based authentication
- Patient profile management
- Medical history management
- Medication records
- Lab report management
- Medical document upload
- Patient health timeline
- Previous clinical summaries
- Doctor access and consent management

### 🤖 AI Clinical Consultation

- AI-guided patient conversation
- Dynamic follow-up questions
- Structured clinical information extraction
- Missing information detection
- Possible red-flag detection
- AI-generated clinical summary
- Conversation history storage
- Patient-specific consultation sessions

### 📄 Medical Document Processing

- Upload PDF and image-based medical documents
- PDF text extraction
- OCR using Tesseract
- Extracted text storage
- Lab report management
- Medication information management

### 👨‍⚕️ Physician Module

- Physician registration and login
- View authorized patients
- View patient medical history
- View uploaded medical documents
- View lab reports and medications
- View patient timeline
- Review AI-generated clinical summaries
- Edit summaries
- Verify or reject summaries
- Add physician notes

### 🚨 Emergency Support

- Red-flag detection during consultation
- Emergency alert workflow
- Dedicated emergency interface

### 🔐 Authentication & Access Control

- JWT authentication
- Role-based access control
- Patient / Physician / Admin roles
- Patient-physician consent management
- Protected API routes
- Audit logging

### 🏥 ABDM Integration Layer

Clinova includes an ABDM integration layer prepared for future healthcare-system integration.

The current implementation provides:

- Mock ABHA profile linking
- Mock ABHA ID generation
- Mock FHIR-style health record exchange
- Structured clinical data exchange

> Note: The current ABDM/ABHA implementation is a mock integration for the prototype and is not a live ABDM production integration.

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │       Patient       │
                    └──────────┬──────────┘
                               │
              Text / Voice / Medical Documents
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │      + Vite         │
                    └──────────┬──────────┘
                               │
                          REST APIs
                               │
                               ▼
                    ┌─────────────────────┐
                    │    FastAPI Backend  │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
       AI Services        OCR Services      Business Logic
             │                 │                 │
             ▼                 ▼                 ▼
        Gemini LLM         Tesseract OCR      SQLAlchemy
             │                                   │
             └────────────────┬──────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ PostgreSQL /        │
                    │ Supabase PostgreSQL │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Physician Dashboard│
                    │  Review & Verify    │
                    └─────────────────────┘

🔄 Main Workflow

Patient
   ↓
Authentication
   ↓
Patient Profile
   ↓
Consent
   ↓
AI Consultation
   ↓
Information Extraction
   ↓
Missing Information Detection
   ↓
Red-Flag Detection
   ↓
Medical Document / OCR Processing
   ↓
Clinical Summary Generation
   ↓
Physician Review
   ↓
Edit / Verify / Reject
   ↓
Verified Clinical Record
   ↓
Patient Timeline

🧠 AI Workflow

Clinova uses AI during the patient case-taking process to collect and
structure clinical information.

1. AI Follow-up Questions

The AI analyzes the existing conversation and asks one relevant
follow-up question at a time.

2. Information Extraction

Patient responses are converted into structured clinical information
such as:

Chief complaint

History of present illness

Past medical history

Past surgical history

Allergies

Family history

Personal history

Review of systems

3. Missing Information Detection

The system checks the conversation for important missing clinical
information.

4. Red-Flag Detection

The AI identifies potentially concerning symptoms and assigns a priority
such as:

Normal

Urgent

Emergency

The red-flag system is intended as an assistance mechanism and does not
provide a final medical diagnosis.

5. Clinical Summary

The collected information, medical history, documents, laboratory
reports, medications, and red flags are combined to generate a
structured clinical summary.

The summary is initially treated as a draft and can be reviewed by a
doctor.

📄 Document & OCR Pipeline

Medical Document
       ↓
File Upload
       ↓
PDF / Image Detection
       ↓
Text Extraction / OCR
       ↓
Extracted Medical Text
       ↓
Structured Patient Records
       ↓
Clinical Summary

Supported document types:

PDF

JPG

JPEG

PNG

WEBP

Maximum uploaded document size:

10 MB

👨‍⚕️ Human-in-the-Loop

Clinova does not treat AI-generated information as the final clinical
record.

The workflow is:

AI Generated Information
          ↓
      Draft Summary
          ↓
   Physician Review
          ↓
     Edit / Verify
          ↓
   Trusted Clinical Record

This keeps the doctor as the final reviewer of the generated clinical
information.

🛠️ Technology Stack

Frontend

React 19

Vite

React Router

JavaScript / JSX

CSS

Backend

Python

FastAPI

Uvicorn

SQLAlchemy

Alembic

Pydantic

PostgreSQL

Supabase PostgreSQL

AI & NLP

Google Gemini

LangChain

Structured AI output

Clinical information extraction

Missing information detection

Red-flag detection

Clinical summary generation

Document Processing

Tesseract OCR

PyTesseract

PyMuPDF

Pillow

Authentication & Security

JWT

Passlib

bcrypt

Role-based access control

Consent-based physician access

Audit logs

📁 Project Structure

Clinova/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── common/
│   │   │   ├── consultation/
│   │   │   ├── emergency/
│   │   │   ├── patient/
│   │   │   └── physician/
│   │   │
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── patient/
│   │   │   └── physician/
│   │   │
│   │   ├── routes/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── dependencies/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── config.py
│   │   ├── database.py
│   │   └── main.py
│   │
│   ├── alembic/
│   ├── requirements.txt
│   └── alembic.ini
│
└── README.md

⚙️ Backend Setup

1. Clone the Repository

git clone <YOUR_REPOSITORY_URL>
cd Clinova

2. Create Backend Environment

cd backend

python -m venv venv

Windows

venv\Scripts\activate

3. Install Dependencies

python -m pip install -r requirements.txt

4. Configure Environment Variables

Create a .env file inside the backend folder:

DATABASE_URL=your_postgresql_database_url

JWT_SECRET_KEY=your_secret_key

JWT_ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60

GEMINI_API_KEY=your_gemini_api_key

GEMINI_MODEL=gemini-3.5-flash-lite

APP_NAME=Clinova

APP_ENV=development

DEBUG=True

Never commit your .env file or API keys to GitHub.

5. Start Backend

python -m uvicorn app.main:app --reload

Backend will run at:

http://127.0.0.1:8000

API base:

http://127.0.0.1:8000/api

Swagger documentation:

http://127.0.0.1:8000/docs

💻 Frontend Setup

Open another terminal:

cd frontend

Install dependencies:

npm install

Start development server:

npm run dev

Frontend will normally run at:

http://localhost:5173

🔑 Authentication

Clinova supports three roles:

Patient
Physician
Admin

Authentication is handled using JWT tokens.

The frontend stores the authentication token locally and automatically
sends it with protected API requests:

Authorization: Bearer <token>

🔌 Important API Modules

The backend provides APIs for:

/api/auth
/api/patients
/api/physicians
/api/consent
/api/conversations
/api/history
/api/documents
/api/summaries
/api/emergency
/api/admin
/api/abdm

Health endpoints:

GET /health
GET /health/database

🩺 Clinical Summary Status

Clinical summaries follow a review workflow.

Draft
  ↓
Physician Review
  ↓
Verified / Rejected

The physician can review and modify the generated summary before
verification.

🔐 Security Approach

Clinova uses multiple layers of access control:

JWT authentication

Role-based authorization

Patient-specific access checks

Physician consent

Protected API routes

Password hashing

Audit logging

Session management

AI is used as an assistive layer and is not intended to replace clinical
judgment.

🎯 Problem Clinova Addresses

Traditional patient history collection can be:

Time-consuming

Repetitive

Difficult to structure

Dependent on patient communication

Scattered across multiple medical documents

Difficult to review quickly

Clinova aims to create a structured digital patient history before the
doctor consultation.

💡 Key Idea

Instead of making the doctor collect everything manually:

Patient
   ↓
Tell your health story
   ↓
AI structures the information
   ↓
Documents are digitized
   ↓
Important information is organized
   ↓
Clinical summary is generated
   ↓
Doctor reviews it
   ↓
Doctor makes the final clinical decision

🚧 Current Prototype Limitations

Clinova is currently a prototype designed to demonstrate the complete
patient case-taking workflow.

Some integrations are represented using mock implementations, including:

ABHA linking

ABDM health record exchange

FHIR-style exchange

The current document storage uses backend file storage and would require
production-grade object storage for large-scale deployment.

🔮 Future Scope

Live ABDM/ABHA integration

FHIR-based interoperability

More Indian regional languages

Improved multilingual speech support

Better medical document extraction

Hospital Information System integration

Advanced clinical trend visualization

Production-grade cloud storage

Improved accessibility for elderly and low-literacy users

AYUSH-specific case-taking workflows

👥 Team

Team: BugBustersX1

Project: Clinova

Problem Statement: 26047

Theme: MedTech / BioTech / HealthTech

Category: Software

📜 Disclaimer

Clinova is an assistive healthcare software prototype.

It is not intended to provide a final medical diagnosis or replace a
qualified healthcare professional.

AI-generated information should be reviewed and verified by a doctor
before being treated as part of the clinical record.

⭐ Clinova

Turning patient conversations and medical documents into structured
clinical information.