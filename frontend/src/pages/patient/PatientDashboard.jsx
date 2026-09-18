import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Loader from "../../components/common/Loader";
import PatientCard from "../../components/patient/PatientCard";
import SummaryCard from "../../components/patient/SummaryCard";

import { usePatient } from "../../hooks/usePatient";

import {
  uploadDocument,
  runOCR,
} from "../../services/documentService";

export default function PatientDashboard() {
  const navigate = useNavigate();

  const {
    profile,
    summaries,
    labReports,
    medications,
    documents,
    setDocuments,
    loading,
    error,
  } = usePatient();

  const fileRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  async function handleUploadAndOCR() {
    const file = fileRef.current?.files?.[0];

    if (!file) {
      setUploadError("Please select a medical document.");
      return;
    }

    if (!profile?.id) {
      setUploadError("Patient profile not loaded.");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadMessage("");

    try {
      const formData = new FormData();

      formData.append("patient_id", profile.id);
      formData.append("file", file);

      const uploaded = await uploadDocument(formData);

      const ocrDocument = await runOCR(uploaded.id);

      setDocuments([
        ocrDocument,
        ...documents,
      ]);

      setUploadMessage(
        "Document uploaded and OCR completed successfully."
      );

      fileRef.current.value = "";
    } catch (err) {
      setUploadError(
        err.message ||
          "Unable to upload and process the document."
      );
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <Loader text="Loading your medical dashboard..." />
    );
  }

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>Patient Dashboard</h1>

          <p>
            Your health information in one place.
          </p>
        </div>

        <div className="page-header-actions">

          <Link
            to="/patient/doctors"
            className="primary-link-button"
          >
            My Doctors
          </Link>

          <Link
            to="/patient/profile"
            className="primary-link-button"
          >
            Edit Profile
          </Link>

          <Link
            to="/patient/consultation"
            className="primary-link-button"
          >
            Start Consultation
          </Link>

        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <PatientCard profile={profile} />

      {/* CLICKABLE HEALTH CARDS */}
      <div className="stats-grid">

        <Link
          to="/patient/documents"
          className="stat-card clickable-stat-card"
        >
          <strong>{documents.length}</strong>
          <span>Documents</span>
          <small>View medical documents →</small>
        </Link>

        <Link
          to="/patient/labs"
          className="stat-card clickable-stat-card"
        >
          <strong>{labReports.length}</strong>
          <span>Lab Reports</span>
          <small>View lab reports →</small>
        </Link>

        <Link
          to="/patient/medications"
          className="stat-card clickable-stat-card"
        >
          <strong>{medications.length}</strong>
          <span>Medications</span>
          <small>View medications →</small>
        </Link>

        <Link
          to="/patient/summaries"
          className="stat-card clickable-stat-card"
        >
          <strong>{summaries.length}</strong>
          <span>Clinical Summaries</span>
          <small>View summaries →</small>
        </Link>

      </div>

      {/* EMERGENCY SUPPORT */}
      <section className="emergency-support-card">

        <div className="emergency-support-content">

          <div className="emergency-support-icon">
            🚨
          </div>

          <div>
            <h2>Emergency Support</h2>

            <p>
              Check for emergency symptoms and
              get immediate support from your consultation.
            </p>
          </div>

        </div>

        <button
          type="button"
          className="emergency-support-button"
          onClick={() =>
            navigate("/patient/emergency")
          }
        >
          Open Emergency Support
        </button>

      </section>

      {/* DOCUMENT UPLOAD */}
      <section className="dashboard-section">

        <div className="section-header">
          <div>
            <h2>Upload Medical Report</h2>

            <p>
              Upload a PDF or image of your medical report.
              Clinova will extract the text using OCR.
            </p>
          </div>
        </div>

        {uploadMessage && (
          <div className="alert alert-success">
            {uploadMessage}
          </div>
        )}

        {uploadError && (
          <div className="alert alert-error">
            {uploadError}
          </div>
        )}

        <div className="upload-card dashboard-upload-card">

          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            disabled={uploading}
          />

          <button
            className="btn btn-primary"
            onClick={handleUploadAndOCR}
            disabled={uploading}
          >
            {uploading
              ? "Processing..."
              : "Upload & Run OCR"}
          </button>

        </div>

        {uploading && (
          <Loader
            text="Uploading document and extracting text..."
          />
        )}

      </section>

      {/* LATEST SUMMARY */}
      <section className="dashboard-section">

        <div className="section-header">
          <h2>Latest Clinical Summary</h2>

          <Link to="/patient/summaries">
            View all
          </Link>
        </div>

        {summaries.length > 0 ? (
          <SummaryCard summary={summaries[0]} />
        ) : (
          <div className="empty-state">
            No clinical summaries yet.
          </div>
        )}

      </section>

    </div>
  );
}