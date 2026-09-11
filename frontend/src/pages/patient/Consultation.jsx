import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ConsultationHeader from "../../components/consultation/ConsultationHeader";
import ChatWindow from "../../components/consultation/ChatWindow";
import ChatInput from "../../components/consultation/ChatInput";
import RedFlagAlert from "../../components/consultation/RedFlagAlert";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";

import { usePatient } from "../../hooks/usePatient";
import { useConversation } from "../../hooks/useConversation";

import {
  generateSummary,
} from "../../services/summaryService";

export default function Consultation() {
  const navigate = useNavigate();

  const {
    profile,
  } = usePatient();

  const {
    session,
    conversation,
    messages,
    nextQuestion,
    extractedData,
    missingInformation,
    redFlags,
    loading,
    sending,
    error,
    completed,

    startConsultation,
    sendPatientMessage,
    complete,
  } = useConversation(
    profile?.id
  );

  const [starting, setStarting] =
    useState(true);

  const [generatingSummary, setGeneratingSummary] =
    useState(false);

  const [summary, setSummary] =
    useState(null);

  const [localError, setLocalError] =
    useState("");

  /*
   * Start consultation automatically
   * when patient profile is available.
   */
  useEffect(() => {
    if (!profile?.id) {
      return;
    }

    let cancelled = false;

    async function start() {
      try {
        setStarting(true);

        await startConsultation();
      } catch (err) {
        if (!cancelled) {
          setLocalError(
            err.message ||
              "Unable to start consultation."
          );
        }
      } finally {
        if (!cancelled) {
          setStarting(false);
        }
      }
    }

    start();

    return () => {
      cancelled = true;
    };
  }, [profile?.id]);

  async function handleSend(message) {
    try {
      setLocalError("");

      await sendPatientMessage(
        message
      );
    } catch (err) {
      setLocalError(
        err.message ||
          "Unable to send message."
      );
    }
  }

  async function handleComplete() {
    try {
      setLocalError("");

      await complete();
    } catch (err) {
      setLocalError(
        err.message ||
          "Unable to complete consultation."
      );
    }
  }

  async function handleGenerateSummary() {
    if (!profile?.id) {
      return;
    }

    setGeneratingSummary(true);
    setLocalError("");

    try {
      const generated =
        await generateSummary({
          patient_id: profile.id,
          conversation_id:
            conversation?.id || null,
        });

      setSummary(generated);
    } catch (err) {
      setLocalError(
        err.message ||
          "Unable to generate clinical summary."
      );
    } finally {
      setGeneratingSummary(false);
    }
  }

  if (!profile || starting) {
    return (
      <Loader text="Starting your secure consultation..." />
    );
  }

  return (
    <div className="consultation-page">
      <ConsultationHeader
        conversation={conversation}
        completed={completed}
        loading={loading}
        onComplete={handleComplete}
      />

      {(error || localError) && (
        <div className="alert alert-error consultation-error">
          {localError || error}
        </div>
      )}

      <div className="consultation-layout">
        <main className="consultation-main">
          <ChatWindow
            messages={messages}
            nextQuestion={nextQuestion}
        />

          {!completed && (
            <ChatInput
              onSend={handleSend}
              disabled={
                sending ||
                loading
              }
            />
          )}
        </main>

        <aside className="consultation-sidebar">
          <RedFlagAlert
            redFlags={redFlags}
          />


          <div className="info-panel">
            <h3>
              Information Collected
            </h3>

            {extractedData ? (
              <ExtractedInformation
                data={
                  extractedData.data ||
                  extractedData
                }
              />
            ) : (
              <p className="muted-text">
                Start answering questions to
                build your clinical history.
              </p>
            )}
          </div>

          <div className="info-panel">
            <h3>
              Missing Information
            </h3>

            {missingInformation.length > 0 ? (
              <ul className="missing-list">
                {missingInformation.map(
                  (item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="muted-text">
                No additional information detected.
              </p>
            )}
          </div>
        </aside>
      </div>

      {completed && (
        <div className="completion-panel">
          <div>
            <h2>
              Consultation Completed
            </h2>

            <p>
              Your clinical information has been
              collected. You can now generate an
              AI clinical summary.
            </p>
          </div>

          {!summary ? (
            <Button
              onClick={
                handleGenerateSummary
              }
              loading={
                generatingSummary
              }
            >
              Generate Clinical Summary
            </Button>
          ) : (
            <div className="generated-summary">
              <div className="summary-header">
                <h2>
                  Clinical Summary
                </h2>

                <span
                  className={`status-badge status-${summary.status}`}
                >
                  {summary.status}
                </span>
              </div>

              <p>
                {summary.summary}
              </p>

              <Button
                onClick={() =>
                  navigate(
                    `/patient/summaries`
                  )
                }
              >
                View Summary
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ExtractedInformation({
  data,
}) {
  if (!data) {
    return (
      <p className="muted-text">
        No information extracted yet.
      </p>
    );
  }

  const fields = [
    [
      "Chief Complaint",
      data.chief_complaint,
    ],
    [
      "History of Present Illness",
      data.history_of_present_illness,
    ],
    [
      "Past Medical History",
      data.past_medical_history,
    ],
    [
      "Past Surgical History",
      data.past_surgical_history,
    ],
    [
      "Allergies",
      data.allergies,
    ],
    [
      "Family History",
      data.family_history,
    ],
    [
      "Personal History",
      data.personal_history,
    ],
    [
      "Review of Systems",
      data.review_of_systems,
    ],
  ];

  const available =
    fields.filter(
      ([, value]) =>
        value !== null &&
        value !== undefined &&
        value !== ""
    );

  if (!available.length) {
    return (
      <p className="muted-text">
        No clinical information extracted yet.
      </p>
    );
  }

  return (
    <div className="extracted-fields">
      {available.map(
        ([label, value]) => (
          <div
            className="extracted-field"
            key={label}
          >
            <span>{label}</span>
            <p>{value}</p>
          </div>
        )
      )}
    </div>
  );
}