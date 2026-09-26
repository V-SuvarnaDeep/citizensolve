import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../../api";
import "./Problems.css";
import "./GovernmentNavbar.css";

function Problems() {
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setError("");

      const response = await axios.get(
        `${API_URL}/problems`
      );

      setProblems(response.data.problems || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load civic problems.");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityClass = (severity) => {
    const value = String(
      severity || ""
    ).toLowerCase();

    if (value === "critical") {
      return "problem-severity critical";
    }

    if (value === "high") {
      return "problem-severity high";
    }

    if (value === "medium") {
      return "problem-severity medium";
    }

    if (value === "low") {
      return "problem-severity low";
    }

    return "problem-severity unknown";
  };

  const getStatusClass = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (value === "approved") {
      return "problem-status approved";
    }

    if (value === "rejected") {
      return "problem-status rejected";
    }

    if (value === "submitted") {
      return "problem-status submitted";
    }

    return "problem-status";
  };

  const highPriorityProblems = problems.filter(
    (problem) => {
      const severity = String(
        problem.ai_analysis?.severity || ""
      ).toLowerCase();

      return (
        severity === "critical" ||
        severity === "high"
      );
    }
  );

  const submittedProblems = problems.filter(
    (problem) =>
      problem.status === "submitted"
  );

  const approvedProblems = problems.filter(
    (problem) =>
      problem.status === "approved"
  );

  return (
    <div className="problems-page">

      {/* GOVERNMENT NAVBAR */}

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


      {/* MAIN CONTENT */}

      <main className="problems-content">

        {/* HEADER */}

        <div className="problems-header">

          <div>

            <p className="problems-label">
              GOVERNMENT WORKSPACE
            </p>

            <h1 className="problems-title">
              Civic Problems
            </h1>

            <p className="problems-subtitle">
              AI-ranked civic problems requiring government validation
            </p>

          </div>

          <button
            className="problems-refresh-button"
            onClick={fetchProblems}
          >
            Refresh
          </button>

        </div>


        {/* LOADING */}

        {loading && (
          <div className="problems-message">
            Loading civic problems...
          </div>
        )}


        {/* ERROR */}

        {error && (
          <div className="problems-error">
            {error}
          </div>
        )}


        {!loading && !error && (
          <>

            {/* SUMMARY CARDS */}

            <div className="problem-stats">

              <div className="problem-stat-card">

                <div className="problem-stat-top">
                  <span className="problem-stat-dot blue"></span>
                  TOTAL PROBLEMS
                </div>

                <div className="problem-stat-number">
                  {problems.length}
                </div>

                <div className="problem-stat-description">
                  Civic problems received
                </div>

              </div>


              <div className="problem-stat-card">

                <div className="problem-stat-top">
                  <span className="problem-stat-dot orange"></span>
                  HIGH PRIORITY
                </div>

                <div className="problem-stat-number">
                  {highPriorityProblems.length}
                </div>

                <div className="problem-stat-description">
                  Critical and high severity
                </div>

              </div>


              <div className="problem-stat-card">

                <div className="problem-stat-top">
                  <span className="problem-stat-dot purple"></span>
                  AWAITING REVIEW
                </div>

                <div className="problem-stat-number">
                  {submittedProblems.length}
                </div>

                <div className="problem-stat-description">
                  Waiting for validation
                </div>

              </div>


              <div className="problem-stat-card">

                <div className="problem-stat-top">
                  <span className="problem-stat-dot green"></span>
                  APPROVED
                </div>

                <div className="problem-stat-number">
                  {approvedProblems.length}
                </div>

                <div className="problem-stat-description">
                  Problems approved by government
                </div>

              </div>

            </div>


            {/* PRIORITY QUEUE */}

            <section className="priority-table-section">

              <div className="priority-table-header">

                <div>

                  <h2>
                    AI Priority Queue
                  </h2>

                  <p>
                    Problems are ranked by Civiora AI
                    before government validation.
                  </p>

                </div>

                <span className="queue-count">
                  {problems.length} Problems
                </span>

              </div>


              {problems.length === 0 ? (

                <div className="problems-message">
                  No civic problems have been submitted yet.
                </div>

              ) : (

                <div className="table-wrapper">

                  <table className="priority-table">

                    <thead>

                      <tr>

                        <th>
                          RANK
                        </th>

                        <th>
                          PROBLEM
                        </th>

                        <th>
                          CATEGORY
                        </th>

                        <th>
                          LOCATION
                        </th>

                        <th>
                          SEVERITY
                        </th>

                        <th>
                          URGENCY
                        </th>

                        <th>
                          STATUS
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {problems.map((problem) => {

                        const analysis =
                          problem.ai_analysis || {};

                        return (
                          <tr
                            key={problem.id}
                            className="problem-row"
                            onClick={() =>
                              navigate(
                                `/government/review?id=${problem.id}`
                              )
                            }
                          >

                            <td className="rank-cell">

                              <span className="rank-number">
                                #{problem.priority_rank}
                              </span>

                            </td>


                            <td className="problem-cell">

                              <div className="problem-name">
                                {problem.title}
                              </div>

                              <div className="problem-description">
                                {analysis.summary ||
                                  problem.description}
                              </div>

                            </td>


                            <td>

                              <span className="category-text">
                                {problem.category || "—"}
                              </span>

                            </td>


                            <td>

                              <div className="location-text">
                                {problem.location || "—"}
                              </div>

                            </td>


                            <td>

                              <span
                                className={getSeverityClass(
                                  analysis.severity
                                )}
                              >
                                {analysis.severity ||
                                  "Unknown"}
                              </span>

                            </td>


                            <td>

                              <span className="urgency-text">
                                {analysis.urgency ||
                                  problem.urgency ||
                                  "—"}
                              </span>

                            </td>


                            <td>

                              <span
                                className={getStatusClass(
                                  problem.status
                                )}
                              >
                                {problem.status ||
                                  "Unknown"}
                              </span>

                            </td>

                          </tr>
                        );

                      })}

                    </tbody>

                  </table>

                </div>

              )}

            </section>


            <p className="table-hint">
              Click any problem to open its government review.
            </p>

          </>
        )}

      </main>

    </div>
  );
}

export default Problems;