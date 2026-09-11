import { useState } from "react";

import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import SummaryCard from "../../components/patient/SummaryCard";

import {
  generateSummary,
} from "../../services/summaryService";

import { usePatient } from "../../hooks/usePatient";

export default function Summaries() {
  const {
    profile,
    summaries,
    setSummaries,
  } = usePatient();

  const [generating, setGenerating] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleGenerate() {
    if (!profile?.id) {
      setError(
        "Patient profile not loaded."
      );
      return;
    }

    setGenerating(true);
    setError("");

    try {
      const summary =
        await generateSummary({
          patient_id: profile.id,
        });

      setSummaries([
        summary,
        ...summaries,
      ]);
    } catch (err) {
      setError(
        err.message ||
          "Unable to generate summary."
      );
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Clinical Summaries</h1>
          <p>
            AI-generated and physician-reviewed
            clinical summaries.
          </p>
        </div>

        <Button
          onClick={handleGenerate}
          loading={generating}
        >
          Generate Summary
        </Button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {generating && (
        <Loader text="Generating clinical summary..." />
      )}

      {!summaries.length && !generating ? (
        <div className="empty-state">
          No clinical summaries yet.
        </div>
      ) : (
        <div className="summary-list">
          {summaries.map((summary) => (
            <SummaryCard
              key={summary.id}
              summary={summary}
            />
          ))}
        </div>
      )}
    </div>
  );
}