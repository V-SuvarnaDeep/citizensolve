import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./ProblemDetails.css";

function ProblemDetails() {
  const { id } = useParams();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProblem = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/problems/${id}`
        );

        if (!response.ok) {
          throw new Error("Unable to load problem");
        }

        const data = await response.json();

        setProblem(data.problem || data);
      } catch (error) {
        console.error(error);
        setError("Unable to load this problem.");
      } finally {
        setLoading(false);
      }
    };

    loadProblem();
  }, [id]);

  if (loading) {
    return (
      <div className="university-problem-details-page">
        <div className="problem-details-message">
          Loading problem details...
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="university-problem-details-page">
        <div className="problem-details-error">
          {error || "Problem not found."}
        </div>
      </div>
    );
  }

  const analysis = problem.ai_analysis || {};

  return (
    <div className="university-problem-details-page">

      <nav className="university-navbar">

        <Link
          to="/university"
          className="university-logo"
        >
          CIVIORA
        </Link>

        <div className="university-nav-links">

          <Link to="/university">
            Dashboard
          </Link>

          <Link
            to="/university/problems"
            className="active"
          >
            Problems
          </Link>

          <Link to="/university/solutions">
            Solutions
          </Link>

          <Link to="/university/meetings">
            Meetings
          </Link>

          <Link to="/university/notifications">
            Notifications
          </Link>

          <Link to="/university/settings">
            Settings
          </Link>

        </div>

        <Link
          to="/login"
          className="university-logout"
        >
          Logout
        </Link>

      </nav>

      <main className="problem-details-content">

        <Link
          to="/university/problems"
          className="back-link"
        >
          ← Back to Problems
        </Link>

        <div className="problem-details-header">

          <div>

            <span className="priority-badge">
              Priority #{problem.priority_rank}
            </span>

            <h1>
              {problem.title}
            </h1>

            <p>
              {problem.description}
            </p>

          </div>

          <span
            className={`severity-badge ${
              analysis.severity
                ? `severity-${analysis.severity.toLowerCase()}`
                : "severity-medium"
            }`}
          >
            {analysis.severity || "Medium"}
          </span>

        </div>

        <section className="details-section">

          <div className="section-title">

            <p>
              PROBLEM INFORMATION
            </p>

            <h2>
              Problem Overview
            </h2>

          </div>

          <div className="information-grid">

            <div className="information-item">

              <span>
                Category
              </span>

              <strong>
                {problem.category || "N/A"}
              </strong>

            </div>

            <div className="information-item">

              <span>
                Location
              </span>

              <strong>
                {problem.location || "N/A"}
              </strong>

            </div>

            <div className="information-item">

              <span>
                Urgency
              </span>

              <strong>
                {analysis.urgency ||
                  problem.urgency ||
                  "N/A"}
              </strong>

            </div>

            <div className="information-item">

              <span>
                Affected Population
              </span>

              <strong>
                {analysis.affectedPopulation ||
                  "N/A"}
              </strong>

            </div>

            <div className="information-item">

              <span>
                Geographic Impact
              </span>

              <strong>
                {analysis.geographicImpact ||
                  "N/A"}
              </strong>

            </div>

            <div className="information-item">

              <span>
                Safety Risk
              </span>

              <strong>
                {analysis.safetyRisk ||
                  "N/A"}
              </strong>

            </div>

          </div>

        </section>

        <section className="details-section">

          <div className="section-title">

            <p>
              AI ANALYSIS
            </p>

            <h2>
              Civiora AI Assessment
            </h2>

          </div>

          <div className="ai-analysis-box">

            <div>

              <span>
                AI Summary
              </span>

              <p>
                {analysis.summary ||
                  "No AI summary available."}
              </p>

            </div>

            <div className="analysis-grid">

              <div>

                <span>
                  Visual Severity
                </span>

                <strong>
                  {analysis.visualSeverity ||
                    "N/A"}
                </strong>

              </div>

              <div>

                <span>
                  Time Sensitivity
                </span>

                <strong>
                  {analysis.timeSensitivity ||
                    "N/A"}
                </strong>

              </div>

              <div>

                <span>
                  Geographic Impact
                </span>

                <strong>
                  {analysis.geographicImpact ||
                    "N/A"}
                </strong>

              </div>

              <div>

                <span>
                  Safety Risk
                </span>

                <strong>
                  {analysis.safetyRisk ||
                    "N/A"}
                </strong>

              </div>

            </div>

          </div>

        </section>

        {analysis.visualFindings && (

          <section className="details-section">

            <div className="section-title">

              <p>
                VISUAL INSPECTION
              </p>

              <h2>
                AI Visual Findings
              </h2>

            </div>

            <div className="visual-findings-box">

              <p>
                {analysis.visualFindings}
              </p>

            </div>

          </section>

        )}

        <section className="solution-action">

          <div>

            <p className="solution-label">
              UNIVERSITY RESPONSE
            </p>

            <h2>
              Ready to develop a solution?
            </h2>

            <p>
              Review the problem carefully and propose
              a practical solution using your university's
              expertise and resources.
            </p>

          </div>

          <Link
            to={`/university/solutions/new?problem=${problem.id}`}
            className="develop-button"
          >
            Develop Solution →
          </Link>

        </section>

      </main>

    </div>
  );
}

export default ProblemDetails;