import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./SolutionReview.css";

function SolutionReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [solution, setSolution] = useState(null);
  const [problem, setProblem] = useState(null);

  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchSolution = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data: solutionData,
        error: solutionError,
      } = await supabase
        .from("solutions")
        .select("*")
        .eq("id", id)
        .single();

      if (solutionError) {
        throw solutionError;
      }

      setSolution(solutionData);

      const {
        data: problemData,
        error: problemError,
      } = await supabase
        .from("problems")
        .select("*")
        .eq("id", solutionData.problem_id)
        .single();

      if (problemError) {
        throw problemError;
      }

      setProblem(problemData);
      setFeedback(solutionData.government_feedback || "");
    } catch (err) {
      console.error("Error fetching solution:", err);
      setError("Unable to load the solution.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSolution();
  }, [fetchSolution]);

  const updateSolutionStatus = async (status) => {
    if (!solution) {
      return;
    }

    if (status === "rejected" && !feedback.trim()) {
      setError("Please provide feedback before rejecting the solution.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const {
        error: updateError,
      } = await supabase
        .from("solutions")
        .update({
          status: status,
          government_feedback: feedback.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", solution.id);

      if (updateError) {
        throw updateError;
      }

      navigate("/government/solutions");
    } catch (err) {
      console.error("Error updating solution:", err);
      setError("Unable to update the solution.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="government-solution-review-page">
        <div className="government-review-loading">
          Loading solution...
        </div>
      </div>
    );
  }

  if (error && !solution) {
    return (
      <div className="government-solution-review-page">
        <div className="government-review-error">
          {error}
        </div>

        <Link
          to="/government/solutions"
          className="back-to-solutions-button"
        >
          ← Back to Solutions
        </Link>
      </div>
    );
  }

  if (!solution) {
    return null;
  }

  return (
    <div className="government-solution-review-page">
      <nav className="government-review-navbar">
        <div className="government-review-brand">
          CIVIORA
        </div>

        <div className="government-review-nav-links">
          <Link to="/government">
            Dashboard
          </Link>

          <Link to="/government/solutions">
            Solutions
          </Link>

          <Link to="/government/review">
            Problems
          </Link>
        </div>
      </nav>

      <main className="government-review-container">
        <Link
          to="/government/solutions"
          className="back-to-solutions-button"
        >
          ← Back to Solutions
        </Link>

        <div className="government-review-header">
          <div>
            <span className="government-review-label">
              GOVERNMENT TECHNICAL REVIEW
            </span>

            <h1>{solution.title}</h1>

            <p>
              Review the university's proposed solution before
              forwarding it for implementation.
            </p>
          </div>

          <span
            className={`solution-status ${solution.status}`}
          >
            {solution.status}
          </span>
        </div>

        {error && (
          <div className="government-review-error">
            {error}
          </div>
        )}

        <section className="government-review-section">
          <div className="section-heading">
            <h2>Civic Problem</h2>
            <span>
              Original problem submitted by citizen
            </span>
          </div>

          {problem ? (
            <div className="problem-review-card">
              <h3>{problem.title}</h3>

              <p className="problem-description">
                {problem.description}
              </p>

              <div className="problem-details-grid">
                <div>
                  <span>Category</span>
                  <strong>
                    {problem.category || "Not available"}
                  </strong>
                </div>

                <div>
                  <span>Location</span>
                  <strong>
                    {problem.location || "Not available"}
                  </strong>
                </div>

                <div>
                  <span>Priority</span>
                  <strong>
                    {problem.priority_rank
                      ? `#${problem.priority_rank}`
                      : "Not ranked"}
                  </strong>
                </div>

                <div>
                  <span>Urgency</span>
                  <strong>
                    {problem.urgency || "Not available"}
                  </strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong>
                    {problem.status || "Not available"}
                  </strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-review-box">
              Problem information is unavailable.
            </div>
          )}
        </section>

        <section className="government-review-section">
          <div className="section-heading">
            <h2>University Solution</h2>
            <span>
              Technical proposal submitted by the university
            </span>
          </div>

          <div className="solution-review-card">
            <div className="review-content-block">
              <h3>Solution Description</h3>
              <p>{solution.description}</p>
            </div>

            <div className="review-content-block">
              <h3>Implementation Approach</h3>
              <p>{solution.approach}</p>
            </div>

            <div className="review-content-block">
              <h3>Technologies</h3>
              <p>{solution.technologies}</p>
            </div>

            <div className="review-content-block">
              <h3>Expected Impact</h3>
              <p>{solution.expected_impact}</p>
            </div>
          </div>
        </section>

        <section className="government-review-section">
          <div className="section-heading">
            <h2>Government Decision</h2>
            <span>
              Provide technical feedback before making a decision.
            </span>
          </div>

          <div className="feedback-card">
            <label htmlFor="government-feedback">
              Government Feedback
            </label>

            <textarea
              id="government-feedback"
              value={feedback}
              onChange={(event) =>
                setFeedback(event.target.value)
              }
              placeholder="Enter feedback, implementation requirements, concerns, or approval notes..."
              rows="6"
            />

            <div className="review-actions">
              <button
                type="button"
                className="reject-solution-button"
                onClick={() =>
                  updateSolutionStatus("rejected")
                }
                disabled={submitting}
              >
                {submitting
                  ? "Processing..."
                  : "Reject Solution"}
              </button>

              <button
                type="button"
                className="approve-solution-button"
                onClick={() =>
                  updateSolutionStatus("approved")
                }
                disabled={submitting}
              >
                {submitting
                  ? "Processing..."
                  : "Approve Solution"}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default SolutionReview;