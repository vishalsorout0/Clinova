import { useEffect, useState } from "react";

import {
  getPhysicianPatientRecords,
  getPhysicianDocumentUrl,
} from "../../services/physicianService";

import PatientDetails from "../../components/physician/PatientDetails";

export default function PatientOverview({
  patient,
  physician,
  onSummarySelect,
}) {
  const [records, setRecords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedOcr, setSelectedOcr] = useState(null);
  const [selectedLab, setSelectedLab] = useState(null);

  useEffect(() => {
    if (!patient?.id) {
      setRecords(null);
      return;
    }

    async function loadPatientRecords() {
      try {
        setLoading(true);
        setError("");

        const response =
          await getPhysicianPatientRecords(patient.id);

        setRecords(response);
      } catch (err) {
        setRecords(null);

        setError(
          err.message ||
            "Unable to load patient records."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPatientRecords();
  }, [patient?.id]);

  if (!patient) {
    return (
      <div className="physician-empty-panel">
        <div className="physician-empty-icon">
          +
        </div>

        <h2>Select a patient</h2>

        <p>
          Choose an authorized patient from the
          list to review their clinical information.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-state">
        Loading patient records...
      </div>
    );
  }

  const patientData =
    records?.patient || patient;

  const histories =
    records?.medical_history || [];

  const documents =
    records?.documents || [];

  const labReports =
    records?.lab_reports || [];

  const medications =
    records?.medications || [];

  const summaries =
    records?.summaries || [];

  return (
    <div className="patient-overview-page">

      {/* ================================
          PATIENT PROFILE
      ================================= */}

      <PatientDetails
        patient={patientData}
        physician={physician}
      />

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}


      {/* ================================
          CLINICAL SUMMARIES
      ================================= */}

      <section className="patient-summaries-section">

        <div className="section-heading">

          <div>
            <span className="section-label">
              Clinical Records
            </span>

            <h2>
              Clinical Summaries
            </h2>
          </div>

          <span>
            {summaries.length} summaries
          </span>

        </div>


        {summaries.length === 0 ? (

          <div className="empty-state">

            <h3>
              No summaries available
            </h3>

            <p>
              This patient does not have any
              clinical summaries yet.
            </p>

          </div>

        ) : (

          <div className="summary-list">

            {summaries.map((summary) => (

              <button
                type="button"
                className="summary-list-item"
                key={summary.id}
                onClick={() =>
                  onSummarySelect?.(summary)
                }
              >

                <div>

                  <strong>
                    Summary #{summary.id}
                  </strong>

                  <p>
                    {truncate(
                      summary.summary,
                      150
                    )}
                  </p>

                </div>


                <div className="summary-list-meta">

                  <span
                    className={`summary-status status-${summary.status}`}
                  >
                    {summary.status}
                  </span>

                  <span>
                    →
                  </span>

                </div>

              </button>

            ))}

          </div>

        )}

      </section>


      {/* ================================
          PATIENT INFORMATION
      ================================= */}

      <section className="patient-record-section">

        <div className="section-heading">

          <div>

            <span className="section-label">
              Patient Data
            </span>

            <h2>
              Medical Information
            </h2>

          </div>

        </div>


        <div className="physician-record-grid">


          {/* ================================
              MEDICAL HISTORY
          ================================= */}

          <RecordCard
            title="Medical History"
            count={histories.length}
          >

            {histories.length === 0 ? (

              <p>
                No medical history available.
              </p>

            ) : (

              histories.map((history) => (

                <RecordItem
                  key={history.id}
                  title={
                    history.chief_complaint ||
                    "Medical History"
                  }
                  text={
                    history.history_of_present_illness ||
                    history.past_medical_history ||
                    "History available"
                  }
                />

              ))

            )}

          </RecordCard>


          {/* ================================
              LAB REPORTS
          ================================= */}

          <RecordCard
            title="Lab Reports"
            count={labReports.length}
          >

            {labReports.length === 0 ? (

              <p>
                No lab reports available.
              </p>

            ) : (

              labReports.map((report) => (

                <div
                  className="physician-record-item"
                  key={report.id}
                >

                  <strong>
                    {report.test_name}
                  </strong>

                  <span>
                    Result: {report.result}
                    {report.unit
                      ? ` ${report.unit}`
                      : ""}
                  </span>

                  {report.reference_range && (
                    <span>
                      Reference:{" "}
                      {report.reference_range}
                    </span>
                  )}

                  {report.status && (
                    <span>
                      Status: {report.status}
                    </span>
                  )}

                  {report.report_date && (
                    <span>
                      Date:{" "}
                      {formatDate(
                        report.report_date
                      )}
                    </span>
                  )}

                  <div className="record-actions">

                    <button
                      type="button"
                      className="record-view-button"
                      onClick={() =>
                        setSelectedLab(report)
                      }
                    >
                      View Details
                    </button>


                    {report.document_id && (
                      <button
                        type="button"
                        className="record-view-button"
                        onClick={() =>
                          window.open(
                            getPhysicianDocumentUrl(
                              report.document_id
                            ),
                            "_blank"
                          )
                        }
                      >
                        View Report
                      </button>
                    )}

                  </div>

                </div>

              ))

            )}

          </RecordCard>


          {/* ================================
              MEDICATIONS
          ================================= */}

          <RecordCard
            title="Medications"
            count={medications.length}
          >

            {medications.length === 0 ? (

              <p>
                No medications available.
              </p>

            ) : (

              medications.map((medication) => (

                <RecordItem
                  key={medication.id}
                  title={
                    medication.name
                  }
                  text={[
                    medication.dosage,
                    medication.frequency,
                    medication.status,
                  ]
                    .filter(Boolean)
                    .join(" • ")}
                />

              ))

            )}

          </RecordCard>


          {/* ================================
              DOCUMENTS
          ================================= */}

          <RecordCard
            title="Documents"
            count={documents.length}
          >

            {documents.length === 0 ? (

              <p>
                No documents available.
              </p>

            ) : (

              documents.map((document) => (

                <div
                  className="physician-record-item"
                  key={document.id}
                >

                  <strong>
                    {document.file_name}
                  </strong>

                  <span>
                    {document.status ||
                      "Uploaded"}
                  </span>


                  <div className="record-actions">

                    <button
                      type="button"
                      className="record-view-button"
                      onClick={() =>
                        window.open(
                          getPhysicianDocumentUrl(
                            document.id
                          ),
                          "_blank"
                        )
                      }
                    >
                      View Document
                    </button>


                    {document.ocr_text && (
                      <button
                        type="button"
                        className="record-view-button"
                        onClick={() =>
                          setSelectedOcr(
                            document
                          )
                        }
                      >
                        View OCR
                      </button>
                    )}

                  </div>

                </div>

              ))

            )}

          </RecordCard>


          {/* ================================
              REAL PATIENT TIMELINE
          ================================= */}

          <PatientTimeline
  histories={histories}
  labReports={labReports}
  medications={medications}
  documents={documents}
  summaries={summaries}
  onLabClick={(report) =>
    setSelectedLab(report)
  }
  onSummaryClick={(summary) =>
    onSummarySelect?.(summary)
  }
  onDocumentClick={(document) =>
    window.open(
      getPhysicianDocumentUrl(document.id),
      "_blank"
    )
  }
/>

        </div>

      </section>


      {/* ================================
          OCR MODAL
      ================================= */}

      {selectedOcr && (

        <div
          className="physician-modal-overlay"
          onClick={() =>
            setSelectedOcr(null)
          }
        >

          <div
            className="physician-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="physician-modal-header">

              <div>

                <span className="section-label">
                  Extracted Information
                </span>

                <h2>
                  {selectedOcr.file_name}
                </h2>

              </div>


              <button
                type="button"
                className="modal-close-button"
                onClick={() =>
                  setSelectedOcr(null)
                }
              >
                ×
              </button>

            </div>


            <div className="physician-modal-content">

              <pre className="ocr-text">
                {selectedOcr.ocr_text ||
                  "No OCR text available."}
              </pre>

            </div>

          </div>

        </div>

      )}


      {/* ================================
          LAB REPORT MODAL
      ================================= */}

      {selectedLab && (

        <div
          className="physician-modal-overlay"
          onClick={() =>
            setSelectedLab(null)
          }
        >

          <div
            className="physician-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="physician-modal-header">

              <div>

                <span className="section-label">
                  Laboratory Report
                </span>

                <h2>
                  {selectedLab.test_name}
                </h2>

              </div>


              <button
                type="button"
                className="modal-close-button"
                onClick={() =>
                  setSelectedLab(null)
                }
              >
                ×
              </button>

            </div>


            <div className="lab-details">

              <DetailRow
                label="Result"
                value={`${selectedLab.result || "-"}${
                  selectedLab.unit
                    ? ` ${selectedLab.unit}`
                    : ""
                }`}
              />

              <DetailRow
                label="Reference Range"
                value={
                  selectedLab.reference_range ||
                  "-"
                }
              />

              <DetailRow
                label="Status"
                value={
                  selectedLab.status ||
                  "-"
                }
              />

              <DetailRow
                label="Report Date"
                value={
                  selectedLab.report_date
                    ? formatDate(
                        selectedLab.report_date
                      )
                    : "-"
                }
              />

              <DetailRow
                label="Report Text"
                value={
                  selectedLab.report_text ||
                  "No report text available."
                }
              />

            </div>

          </div>

        </div>

      )}

    </div>
  );
}


/* =================================
   PATIENT TIMELINE
================================= */

function PatientTimeline({
  histories = [],
  labReports = [],
  medications = [],
  documents = [],
  summaries = [],
  onLabClick,
  onSummaryClick,
  onDocumentClick,
}) {
  const events = [];


  /* Medical History */

  histories.forEach((history) => {

    events.push({
      id: `history-${history.id}`,

      type: "Medical History",

      title:
        history.chief_complaint ||
        "Medical History",

      description:
        history.history_of_present_illness ||
        history.past_medical_history ||
        "Medical history record available.",

      date:
        history.updated_at ||
        history.created_at ||
        null,

      clickable: false,
    });

  });


  /* Lab Reports */

  labReports.forEach((report) => {

    events.push({
      id: `lab-${report.id}`,

      type: "Lab Report",

      title:
        report.test_name ||
        "Laboratory Report",

      description: [
        report.result,
        report.unit,
        report.status
          ? `Status: ${report.status}`
          : null,
      ]
        .filter(Boolean)
        .join(" • "),

      date:
        report.report_date ||
        report.created_at ||
        null,

      clickable: true,

      onClick: () =>
        onLabClick?.(report),
    });

  });


  /* Medications */

  medications.forEach((medication) => {

    events.push({
      id: `medication-${medication.id}`,

      type: "Medication",

      title:
        medication.name ||
        "Medication",

      description: [
        medication.dosage,
        medication.frequency,
        medication.status,
      ]
        .filter(Boolean)
        .join(" • "),

      date:
        medication.start_date ||
        medication.created_at ||
        null,

      clickable: false,
    });

  });


  /* Documents */

  documents.forEach((document) => {

    events.push({
      id: `document-${document.id}`,

      type: "Medical Document",

      title:
        document.file_name ||
        "Medical Document",

      description:
        document.status ||
        "Document uploaded",

      date:
        document.uploaded_at ||
        document.created_at ||
        null,

      clickable: true,

onClick: () =>
  onDocumentClick?.(document),
    });

  });


  /* Clinical Summaries */

  summaries.forEach((summary) => {

    events.push({
      id: `summary-${summary.id}`,

      type: "Clinical Summary",

      title:
        `Clinical Summary #${summary.id}`,

      description:
        summary.status === "verified"
          ? "Summary verified by doctor"
          : summary.status === "rejected"
          ? "Summary rejected by doctor"
          : "AI-generated clinical summary",

      date:
        summary.created_at ||
        null,

      clickable: true,

      onClick: () =>
        onSummaryClick?.(summary),
    });

  });


  /* Sort newest first */

  const sortedEvents = events
    .filter((event) => event.date)
    .sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );


  return (
    <div className="patient-timeline-card">

      <div className="physician-record-card-header">

        <div>

          <h3>
            Patient Timeline
          </h3>

          <span className="timeline-subtitle">
            Clinical activity
          </span>

        </div>

        <span>
          {sortedEvents.length}
        </span>

      </div>


      <div className="patient-timeline-body">

        {sortedEvents.length === 0 ? (

          <p>
            No patient activity available.
          </p>

        ) : (

          sortedEvents.map((event) => (

            <div
              className={`patient-timeline-item ${
                event.clickable
                  ? "timeline-clickable"
                  : ""
              }`}
              key={event.id}
              onClick={
                event.clickable
                  ? event.onClick
                  : undefined
              }
              role={
                event.clickable
                  ? "button"
                  : undefined
              }
              tabIndex={
                event.clickable
                  ? 0
                  : undefined
              }
              onKeyDown={(e) => {

                if (
                  event.clickable &&
                  (e.key === "Enter" ||
                    e.key === " ")
                ) {
                  e.preventDefault();
                  event.onClick();
                }

              }}
            >

              <div className="timeline-dot" />


              <div className="timeline-content">

                <span className="timeline-type">
                  {event.type}
                </span>

                <strong>
                  {event.title}
                </strong>

                <p>
                  {event.description}
                </p>

                <small>
                  {formatDate(event.date)}
                </small>


                {event.clickable && (
                  <span className="timeline-view">
                    Click to view →
                  </span>
                )}

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}


/* =================================
   RECORD CARD
================================= */

function RecordCard({
  title,
  count,
  children,
}) {
  return (
    <div className="physician-record-card">

      <div className="physician-record-card-header">

        <h3>
          {title}
        </h3>

        <span>
          {count}
        </span>

      </div>

      <div className="physician-record-card-body">
        {children}
      </div>

    </div>
  );
}


/* =================================
   RECORD ITEM
================================= */

function RecordItem({
  title,
  text,
}) {
  return (
    <div className="physician-record-item">

      <strong>
        {title}
      </strong>

      <span>
        {text ||
          "No details available"}
      </span>

    </div>
  );
}


/* =================================
   DETAIL ROW
================================= */

function DetailRow({
  label,
  value,
}) {
  return (
    <div className="lab-detail-row">

      <strong>
        {label}
      </strong>

      <span>
        {value}
      </span>

    </div>
  );
}


/* =================================
   HELPERS
================================= */

function truncate(
  text = "",
  length
) {
  if (text.length <= length) {
    return text;
  }

  return (
    text.slice(0, length) +
    "..."
  );
}


function formatDate(date) {
  if (!date) {
    return "-";
  }

  try {
    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  } catch {
    return date;
  }
}