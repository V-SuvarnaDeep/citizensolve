import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Review.css";

function Review() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const problemId = searchParams.get("id");

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!problemId) {
      setError("No problem was selected.");
      setLoading(false);
      return;
    }

    fetchProblem();
  }, [problemId]);

  const fetchProblem = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/problems/${problemId}`
      );

      setProblem(response.data.problem);
    } catch (err) {
      console.error(err);
      setError("Unable to load problem details.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      setActionLoading(true);

      await axios.patch(
        `http://127.0.0.1:8000/problems/${problemId}/status`,
        {
          status: status,
        }
      );

      navigate("/government");
    } catch (err) {
      console.error(err);
      setError("Unable to update the problem status.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="review-page">
        <div className="review-message">
          Loading problem details...
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="review-page">
        <div className="review-error">
          {error || "Problem not found."}
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/government")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const analysis = problem.ai_analysis || {};

  return (
    <div className="review-page">

      <div className="review-header">
        <div>
          <button
            className="back-button"
            onClick={() => navigate("/government")}
          >
            ← Back to Dashboard
          </button>

          <h1>Problem Review</h1>

          <p>
            Government validation of an AI-prioritized civic problem
          </p>
        </div>

        <div className="review-rank">
          Priority #{problem.priority_rank}
        </div>
      </div>

      <div className="review-grid">

        <div className="review-card">

          <h2>Problem Details</h2>

          <div className="detail-item">
            <span>Title</span>
            <strong>{problem.title}</strong>
          </div>

          <div className="detail-item">
            <span>Description</span>
            <p>{problem.description}</p>
          </div>

          <div className="detail-item">
            <span>Category</span>
            <p>{problem.category}</p>
          </div>

          <div className="detail-item">
            <span>Location</span>
            <p>{problem.location}</p>
          </div>

          <div className="detail-item">
            <span>Reported Impact</span>
            <p>{problem.impact}</p>
          </div>

          <div className="detail-item">
            <span>Reported Urgency</span>
            <p>{problem.urgency}</p>
          </div>

          {problem.additional_info && (
            <div className="detail-item">
              <span>Additional Information</span>
              <p>{problem.additional_info}</p>
            </div>
          )}

        </div>

        <div className="review-card">

          <h2>AI Analysis</h2>

          <div className="analysis-grid">

            <div className="analysis-item">
              <span>Severity</span>
              <strong>{analysis.severity || "N/A"}</strong>
            </div>

            <div className="analysis-item">
              <span>Urgency</span>
              <strong>{analysis.urgency || "N/A"}</strong>
            </div>

            <div className="analysis-item">
              <span>Safety Risk</span>
              <strong>{analysis.safetyRisk || "N/A"}</strong>
            </div>

            <div className="analysis-item">
              <span>Affected Population</span>
              <strong>
                {analysis.affectedPopulation || "N/A"}
              </strong>
            </div>

            <div className="analysis-item">
              <span>Geographic Impact</span>
              <strong>
                {analysis.geographicImpact || "N/A"}
              </strong>
            </div>

            <div className="analysis-item">
              <span>Time Sensitivity</span>
              <strong>
                {analysis.timeSensitivity || "N/A"}
              </strong>
            </div>

          </div>

          {analysis.summary && (
            <div className="ai-summary">
              <span>AI Summary</span>
              <p>{analysis.summary}</p>
            </div>
          )}

          {analysis.visualFindings && (
            <div className="ai-summary">
              <span>Visual Findings</span>
              <p>{analysis.visualFindings}</p>
            </div>
          )}

        </div>

      </div>

      <div className="decision-card">

        <div>
          <h2>Government Decision</h2>

          <p>
            Review the citizen submission and AI analysis before
            validating the problem.
          </p>
        </div>

        <div className="decision-buttons">

          <button
            className="reject-button"
            disabled={actionLoading}
            onClick={() => updateStatus("rejected")}
          >
            Reject Problem
          </button>

          <button
            className="approve-button"
            disabled={actionLoading}
            onClick={() => updateStatus("approved")}
          >
            Approve Problem
          </button>

        </div>

      </div>

    </div>
  );
}

export default Review;