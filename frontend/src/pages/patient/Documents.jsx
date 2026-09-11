import { useRef, useState } from "react";

import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import DocumentCard from "../../components/patient/DocumentCard";

import {
  uploadDocument,
  deleteDocument,
  runOCR,
} from "../../services/documentService";

import { usePatient } from "../../hooks/usePatient";

export default function Documents() {
  const {
    profile,
    documents,
    setDocuments,
  } = usePatient();

  const fileRef = useRef(null);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleUpload() {
    const file = fileRef.current?.files?.[0];

    if (!file) {
      setError("Please select a file.");
      return;
    }

    if (!profile?.id) {
      setError("Patient profile not loaded.");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();

      formData.append("patient_id", profile.id);
      formData.append("file", file);

      const uploaded =
        await uploadDocument(formData);

      setDocuments([
        uploaded,
        ...documents,
      ]);

      setMessage(
        "Document uploaded successfully."
      );

      fileRef.current.value = "";
    } catch (err) {
      setError(
        err.message ||
          "Document upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleOCR(documentId) {
    try {
      setError("");

      const updated =
        await runOCR(documentId);

      setDocuments(
        documents.map((document) =>
          document.id === documentId
            ? {
                ...document,
                ...updated,
              }
            : document
        )
      );

      setMessage(
        "OCR completed successfully."
      );
    } catch (err) {
      setError(
        err.message ||
          "OCR failed."
      );
    }
  }

  async function handleDelete(documentId) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this document?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDocument(documentId);

      setDocuments(
        documents.filter(
          (document) =>
            document.id !== documentId
        )
      );

      setMessage(
        "Document deleted successfully."
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to delete document."
      );
    }
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Documents</h1>
          <p>
            Upload and manage medical documents.
          </p>
        </div>
      </div>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="upload-card">
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
        />

        <Button
          onClick={handleUpload}
          loading={uploading}
        >
          Upload Document
        </Button>
      </div>

      {uploading && (
        <Loader text="Uploading document..." />
      )}

      <div className="card-grid">
        {documents.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            onOCR={handleOCR}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {!documents.length && !uploading && (
        <div className="empty-state">
          No documents uploaded yet.
        </div>
      )}
    </div>
  );
}