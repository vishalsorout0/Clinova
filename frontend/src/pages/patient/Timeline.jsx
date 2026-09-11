import { useEffect, useState } from "react";

import Loader from "../../components/common/Loader";
import TimelineComponent from "../../components/patient/Timeline";

import { getTimeline } from "../../services/historyService";
import { usePatient } from "../../hooks/usePatient";

export default function Timeline() {
  const { profile } = usePatient();

  const [timeline, setTimeline] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!profile?.id) {
      return;
    }

    setLoading(true);

    getTimeline(profile.id)
      .then((data) => {
        setTimeline(data || []);
      })
      .catch((err) => {
        setError(
          err.message ||
            "Unable to load timeline."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [profile?.id]);

  if (loading) {
    return (
      <Loader text="Loading medical timeline..." />
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Medical Timeline</h1>
          <p>
            Your complete medical journey.
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <TimelineComponent
        items={timeline}
      />
    </div>
  );
}