import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./SolutionSubmit.css";

function SolutionSubmit() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const problemId = searchParams.get("problem");

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [solutionTitle, setSolutionTitle] = useState("");
  const [description, setDescription] = useState("");
  const [approach, setApproach] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [expectedImpact, setExpectedImpact] = useState("");

  useEffect(() => {
    const loadProblem = async () => {
      if (!problemId) {
        setError("No problem was selected.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/problems/${problemId}`
        );

        if (!response.ok) {
          throw new Error("Unable to load problem");
        }

        const data = await response.json();

        setProblem(data.problem || data);
      } catch (error) {
        console.error(error);
        setError(
          "Unable to load the selected problem."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProblem();
  }, [problemId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setSubmitError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        throw new Error(
          "You must be logged in to submit a solution."
        );
      }

      const { error } = await supabase
        .from("solutions")
        .insert({
          problem_id: problemId,
          university_id: session.user.id,
          title: solutionTitle,
          description: description,
          approach: approach,
          technologies: technologies,
          expected_impact: expectedImpact,
          status: "submitted",
        });

      if (error) {
        console.error(error);
        throw new Error(
          error.message || "Unable to submit solution."
        );
      }

      navigate("/university/solutions");
    } catch (error) {
      console.error(error);

      setSubmitError(
        error.message ||
          "Unable to submit the solution."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="solution-submit-page">
        <div className="solution-message">
          Loading problem details...
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="solution-submit-page">
        <div className="solution-error">
          {error || "Problem not found."}
        </div>
      </div>
    );
  }

  const analysis = problem.ai_analysis || {};

  return (
    <div className="solution-submit-page">

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

          <Link to="/university/problems">
            Problems
          </Link>

          <Link
            to="/university/solutions"
            className="active"
          >
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

      <main className="solution-submit-content">

        <Link
          to={`/university/problems/${problem.id}`}
          className="back-link"
        >
          ← Back to Problem
        </Link>

        <div className="solution-page-header">

          <div>

            <p className="solution-label">
              UNIVERSITY RESPONSE
            </p>

            <h1>
              Develop a Solution
            </h1>

            <p>
              Propose a practical solution for the
              government-approved civic problem.
            </p>

          </div>

        </div>

        <section className="selected-problem">

          <div className="selected-problem-header">

            <div>

              <span className="priority-badge">
                Priority #{problem.priority_rank}
              </span>

              <h2>
                {problem.title}
              </h2>

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

          <p className="selected-problem-description">
            {problem.description}
          </p>

          <div className="selected-problem-details">

            <div>
              <span>
                Category
              </span>

              <strong>
                {problem.category || "N/A"}
              </strong>
            </div>

            <div>
              <span>
                Location
              </span>

              <strong>
                {problem.location || "N/A"}
              </strong>
            </div>

            <div>
              <span>
                Affected Population
              </span>

              <strong>
                {analysis.affectedPopulation || "N/A"}
              </strong>
            </div>

          </div>

        </section>

        <section className="solution-form-section">

          <div className="section-title">

            <p>
              SOLUTION PROPOSAL
            </p>

            <h2>
              Solution Details
            </h2>

          </div>

          {submitError && (
            <div className="submit-error">
              {submitError}
            </div>
          )}

          <form
            className="solution-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">

              <label>
                Solution Title
              </label>

              <input
                type="text"
                value={solutionTitle}
                onChange={(event) =>
                  setSolutionTitle(event.target.value)
                }
                placeholder="Enter a title for your solution"
                required
              />

            </div>

            <div className="form-group">

              <label>
                Solution Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Describe your proposed solution"
                rows="5"
                required
              />

            </div>

            <div className="form-group">

              <label>
                Proposed Approach
              </label>

              <textarea
                value={approach}
                onChange={(event) =>
                  setApproach(event.target.value)
                }
                placeholder="Explain how your solution will work and how the problem will be addressed"
                rows="6"
                required
              />

            </div>

            <div className="form-group">

              <label>
                Technologies Required
              </label>

              <input
                type="text"
                value={technologies}
                onChange={(event) =>
                  setTechnologies(event.target.value)
                }
                placeholder="Example: React, IoT sensors, Python, AI"
                required
              />

            </div>

            <div className="form-group">

              <label>
                Expected Impact
              </label>

              <textarea
                value={expectedImpact}
                onChange={(event) =>
                  setExpectedImpact(event.target.value)
                }
                placeholder="Describe the expected social or civic impact"
                rows="5"
                required
              />

            </div>

            <div className="form-actions">

              <Link
                to={`/university/problems/${problem.id}`}
                className="cancel-button"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="submit-solution-button"
                disabled={submitting}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Solution"}
              </button>

            </div>

          </form>

        </section>

      </main>

    </div>
  );
}

export default SolutionSubmit;