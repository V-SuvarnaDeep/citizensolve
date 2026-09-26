import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
  useNavigate
} from "react-router-dom";
import axios from "axios";
import API_URL from "../../api";
import "./Review.css";
import "./GovernmentNavbar.css";

function Review() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const problemId = searchParams.get("id");

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProblem = async () => {
      if (!problemId) {
        setError("No problem was selected.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API_URL}/problems/${problemId}`
        );

        setProblem(response.data.problem);

      } catch (err) {
        console.error(err);
        setError("Unable to load problem details.");
      } finally {
        setLoading(false);
      }
    };

    loadProblem();
  }, [problemId]);


  const updateStatus = async (status) => {
    try {
      setActionLoading(true);
      setError("");

      await axios.patch(
        `${API_URL}/problems/${problemId}/status`,
        {
          status: status
        }
      );

      navigate("/government/problems");

    } catch (err) {
      console.error(err);
      setError(
        "Unable to update the problem status."
      );
    } finally {
      setActionLoading(false);
    }
  };


  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }
    );
  };


  const getSeverityClass = (severity) => {
    const value = String(
      severity || ""
    ).toLowerCase();

    if (value === "critical") {
      return "review-severity critical";
    }

    if (value === "high") {
      return "review-severity high";
    }

    if (value === "medium") {
      return "review-severity medium";
    }

    if (value === "low") {
      return "review-severity low";
    }

    return "review-severity";
  };


  const getStatusClass = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (value === "approved") {
      return "review-status approved";
    }

    if (value === "rejected") {
      return "review-status rejected";
    }

    return "review-status pending";
  };


  if (loading) {
    return (
      <div className="government-review-page">

        <nav className="government-navbar">

          <Link
            to="/government"
            className="government-logo"
          >
            CIVIORA
          </Link>

          <div className="government-nav-links">

            <Link to="/government">
              Home
            </Link>

            <Link
              to="/government/problems"
              className="active"
            >
              Problems
            </Link>

            <Link to="/government/solutions">
              Solutions
            </Link>

            <Link to="/government/meetings">
              Meetings
            </Link>

            <Link to="/government/notifications">
              Notifications
            </Link>

            <Link to="/government/settings">
              Settings
            </Link>

          </div>

          <Link
            to="/login"
            className="government-logout"
          >
            Logout
          </Link>

        </nav>

        <main className="government-review-content">

          <div className="review-message">
            Loading problem details...
          </div>

        </main>

      </div>
    );
  }


  if (error && !problem) {
    return (
      <div className="government-review-page">

        <nav className="government-navbar">

          <Link
            to="/government"
            className="government-logo"
          >
            CIVIORA
          </Link>

          <div className="government-nav-links">

            <Link to="/government">
              Home
            </Link>

            <Link
              to="/government/problems"
              className="active"
            >
              Problems
            </Link>

            <Link to="/government/solutions">
              Solutions
            </Link>

            <Link to="/government/meetings">
              Meetings
            </Link>

            <Link to="/government/notifications">
              Notifications
            </Link>

            <Link to="/government/settings">
              Settings
            </Link>

          </div>

          <Link
            to="/login"
            className="government-logout"
          >
            Logout
          </Link>

        </nav>

        <main className="government-review-content">

          <div className="review-error">
            {error}
          </div>

          <Link
            to="/government/problems"
            className="review-back-link"
          >
            ← Back to Problems
          </Link>

        </main>

      </div>
    );
  }


  if (!problem) {
    return null;
  }


  /*
    AI analysis is stored inside the
    ai_analysis column of the problem.
  */

  const analysis =
    problem.ai_analysis || {};


  return (
    <div className="government-review-page">

      {/* NAVBAR */}

      <nav className="government-navbar">

        <Link
          to="/government"
          className="government-logo"
        >
          CIVIORA
        </Link>

        <div className="government-nav-links">

          <Link to="/government">
            Home
          </Link>

          <Link
            to="/government/problems"
            className="active"
          >
            Problems
          </Link>

          <Link to="/government/solutions">
            Solutions
          </Link>

          <Link to="/government/meetings">
            Meetings
          </Link>

          <Link to="/government/notifications">
            Notifications
          </Link>

          <Link to="/government/settings">
            Settings
          </Link>

        </div>

        <Link
          to="/login"
          className="government-logout"
        >
          Logout
        </Link>

      </nav>


      {/* CONTENT */}

      <main className="government-review-content">

        <Link
          to="/government/problems"
          className="review-back-link"
        >
          ← Back to Problems
        </Link>


        <div className="review-header">

          <p className="review-label">
            GOVERNMENT REVIEW
          </p>

          <h1 className="review-title">
            Civic Problem Review
          </h1>

          <p className="review-subtitle">
            Review the citizen-submitted problem and
            Civiora AI analysis before making a decision.
          </p>

        </div>


        {error && (
          <div className="review-error">
            {error}
          </div>
        )}


        <div className="review-layout">


          {/* =========================
              PROBLEM INFORMATION
          ========================= */}

          <section className="review-main-card">

            <div className="review-card-header">

              <div>

                <span className="review-card-label">
                  CITIZEN SUBMISSION
                </span>

                <h2>
                  {problem.title ||
                    "Untitled Civic Problem"}
                </h2>

              </div>

              <span
                className={getStatusClass(
                  problem.status
                )}
              >
                {problem.status ||
                  "submitted"}
              </span>

            </div>


            {/* DESCRIPTION */}

            <div className="review-section">

              <span className="review-section-label">
                PROBLEM DESCRIPTION
              </span>

              <p className="review-description">
                {problem.description ||
                  "No description available."}
              </p>

            </div>


            {/* BASIC DETAILS */}

            <div className="review-details-grid">

              <div className="review-detail">

                <span>
                  CATEGORY
                </span>

                <strong>
                  {problem.category ||
                    "Not available"}
                </strong>

              </div>


              <div className="review-detail">

                <span>
                  PROBLEM TYPE
                </span>

                <strong>
                  {analysis.problemType ||
                    "Not available"}
                </strong>

              </div>


              <div className="review-detail">

                <span>
                  LOCATION
                </span>

                <strong>
                  {problem.location ||
                    "Not available"}
                </strong>

              </div>


              <div className="review-detail">

                <span>
                  IMPACT
                </span>

                <strong>
                  {problem.impact ||
                    "Not available"}
                </strong>

              </div>


              <div className="review-detail">

                <span>
                  SUBMITTED
                </span>

                <strong>
                  {formatDate(
                    problem.created_at
                  )}
                </strong>

              </div>


              <div className="review-detail">

                <span>
                  PRIORITY RANK
                </span>

                <strong>
                  {problem.priority_rank
                    ? `#${problem.priority_rank}`
                    : "Not ranked"}
                </strong>

              </div>

            </div>


            {/* ADDITIONAL INFORMATION */}

            {problem.additional_info && (

              <div className="ai-summary">

                <span>
                  ADDITIONAL INFORMATION
                </span>

                <p>
                  {problem.additional_info}
                </p>

              </div>

            )}


            {/* =========================
                AI ANALYSIS
            ========================= */}

            <div className="review-ai-section">

              <div className="review-ai-heading">

                <div>

                  <span className="review-section-label">
                    CIVIORA AI ANALYSIS
                  </span>

                  <h3>
                    AI Assessment
                  </h3>

                </div>

                <span className="ai-badge">
                  AI
                </span>

              </div>


              <div className="ai-analysis-grid">

                <div className="ai-analysis-item">

                  <span>
                    SEVERITY
                  </span>

                  <strong
                    className={getSeverityClass(
                      analysis.severity
                    )}
                  >
                    {analysis.severity ||
                      "Not available"}
                  </strong>

                </div>


                <div className="ai-analysis-item">

                  <span>
                    URGENCY
                  </span>

                  <strong>
                    {analysis.urgency ||
                      problem.urgency ||
                      "Not available"}
                  </strong>

                </div>


                <div className="ai-analysis-item">

                  <span>
                    VISUAL SEVERITY
                  </span>

                  <strong>
                    {analysis.visualSeverity ||
                      "Not available"}
                  </strong>

                </div>


                <div className="ai-analysis-item">

                  <span>
                    AFFECTED GROUPS
                  </span>

                  <strong>
                    {analysis.affectedGroups ||
                      "Not available"}
                  </strong>

                </div>


                <div className="ai-analysis-item">

                  <span>
                    AFFECTED POPULATION
                  </span>

                  <strong>
                    {analysis.affectedPopulation ||
                      "Not available"}
                  </strong>

                </div>


                <div className="ai-analysis-item">

                  <span>
                    SAFETY RISK
                  </span>

                  <strong>
                    {analysis.safetyRisk ||
                      "Not available"}
                  </strong>

                </div>


                <div className="ai-analysis-item">

                  <span>
                    GEOGRAPHIC IMPACT
                  </span>

                  <strong>
                    {analysis.geographicImpact ||
                      "Not available"}
                  </strong>

                </div>


                <div className="ai-analysis-item">

                  <span>
                    TIME SENSITIVITY
                  </span>

                  <strong>
                    {analysis.timeSensitivity ||
                      "Not available"}
                  </strong>

                </div>

              </div>


              {/* AI SUMMARY */}

              {analysis.summary && (

                <div className="ai-summary">

                  <span>
                    AI SUMMARY
                  </span>

                  <p>
                    {analysis.summary}
                  </p>

                </div>

              )}


              {/* VISUAL FINDINGS */}

              {analysis.visualFindings && (

                <div className="ai-summary">

                  <span>
                    VISUAL FINDINGS
                  </span>

                  <p>
                    {analysis.visualFindings}
                  </p>

                </div>

              )}


              {/* REQUIRED SKILLS */}

              {analysis.requiredSkills &&
                Array.isArray(
                  analysis.requiredSkills
                ) &&
                analysis.requiredSkills.length > 0 && (

                <div className="ai-summary">

                  <span>
                    REQUIRED SKILLS
                  </span>

                  <p>
                    {analysis.requiredSkills.join(
                      ", "
                    )}
                  </p>

                </div>

              )}


              {/* KEYWORDS */}

              {analysis.keywords &&
                Array.isArray(
                  analysis.keywords
                ) &&
                analysis.keywords.length > 0 && (

                <div className="ai-summary">

                  <span>
                    AI KEYWORDS
                  </span>

                  <p>
                    {analysis.keywords.join(
                      ", "
                    )}
                  </p>

                </div>

              )}

            </div>

          </section>


          {/* =========================
              GOVERNMENT DECISION
          ========================= */}

          <aside className="review-side-card">

            <span className="review-card-label">
              GOVERNMENT DECISION
            </span>

            <h2>
              Validate Problem
            </h2>

            <p>
              Government approval is required before
              Civiora sends this problem to the university
              matching stage.
            </p>


            <div className="decision-note">

              <strong>
                Important
              </strong>

              <span>
                AI provides analysis and priority support.
                The final decision remains with Government.
              </span>

            </div>


            <div className="decision-actions">

              <button
                className="approve-button"
                disabled={
                  actionLoading ||
                  problem.status === "approved"
                }
                onClick={() =>
                  updateStatus("approved")
                }
              >
                {actionLoading
                  ? "Updating..."
                  : problem.status === "approved"
                  ? "Approved"
                  : "Approve Problem"}
              </button>


              <button
                className="reject-button"
                disabled={
                  actionLoading ||
                  problem.status === "rejected"
                }
                onClick={() =>
                  updateStatus("rejected")
                }
              >
                {actionLoading
                  ? "Updating..."
                  : problem.status === "rejected"
                  ? "Rejected"
                  : "Reject Problem"}
              </button>

            </div>


            {/* WORKFLOW */}

            <div className="decision-flow">

              <span>
                CURRENT WORKFLOW
              </span>

              <div className="flow-step active">

                <b>
                  1
                </b>

                Government Review

              </div>

              <div className="flow-line" />

              <div className="flow-step">

                <b>
                  2
                </b>

                University Matching

              </div>

              <div className="flow-line" />

              <div className="flow-step">

                <b>
                  3
                </b>

                Solution Development

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default Review;