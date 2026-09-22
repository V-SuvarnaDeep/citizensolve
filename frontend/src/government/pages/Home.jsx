import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../../api";
import "./Home.css";

function Home() {
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
    const value = String(severity || "").toLowerCase();

    if (value === "critical") {
      return "severity-critical";
    }

    if (value === "high") {
      return "severity-high";
    }

    if (value === "medium") {
      return "severity-medium";
    }

    return "severity-low";
  };

  const criticalProblems = problems.filter(
    (problem) =>
      String(problem.ai_analysis?.severity || "").toLowerCase() ===
      "critical"
  );

  const submittedProblems = problems.filter(
    (problem) => problem.status === "submitted"
  );

  return (
    <div className="government-page">

      {/* GOVERNMENT NAVBAR */}

      <nav className="government-navbar">

        <Link
          to="/government"
          className="government-logo"
        >
          CIVIORA
        </Link>

        <div className="government-nav-links">

          <Link
            to="/government"
            className="active"
          >
            Dashboard
          </Link>

          <Link to="/government">
            Problems
          </Link>

          <Link to="/government/solutions">
            Solutions
          </Link>

          <Link to="/government/companies">
            Companies
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

      {/* DASHBOARD */}

      <main className="government-content">

        <div className="government-header">

          <div>

            <p className="government-label">
              GOVERNMENT WORKSPACE
            </p>

            <h1 className="government-title">
              Government Dashboard
            </h1>

            <p className="government-subtitle">
              AI-ranked civic problems requiring government attention
            </p>

          </div>

          <button
            className="refresh-button"
            onClick={fetchProblems}
          >
            Refresh
          </button>

        </div>

        {loading && (
          <div className="dashboard-message">
            Loading civic problems...
          </div>
        )}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>

            <div className="government-stats">

              <div className="stat-card">

                <div className="stat-number">
                  {problems.length}
                </div>

                <div className="stat-label">
                  Submitted Problems
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-number">
                  {criticalProblems.length}
                </div>

                <div className="stat-label">
                  Critical Problems
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-number">
                  {submittedProblems.length}
                </div>

                <div className="stat-label">
                  Awaiting Validation
                </div>

              </div>

            </div>

            <div className="priority-section">

              <h2 className="section-title">
                AI Priority Queue
              </h2>

              {problems.length === 0 ? (

                <div className="dashboard-message">
                  No civic problems have been submitted yet.
                </div>

              ) : (

                <div className="table-wrapper">

                  <table className="priority-table">

                    <thead>

                      <tr>
                        <th>Rank</th>
                        <th>Problem</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Severity</th>
                        <th>Urgency</th>
                        <th>Status</th>
                      </tr>

                    </thead>

                    <tbody>

                      {problems.map((problem) => {

                        const analysis =
                          problem.ai_analysis || {};

                        return (
                          <tr
                            key={problem.id}
                            onClick={() =>
                              navigate(
                                `/government/review?id=${problem.id}`
                              )
                            }
                            className="problem-row"
                          >

                            <td>

                              <span className="rank">
                                #{problem.priority_rank}
                              </span>

                            </td>

                            <td>

                              <strong>
                                {problem.title}
                              </strong>

                              <div className="problem-summary">
                                {analysis.summary ||
                                  problem.description}
                              </div>

                            </td>

                            <td>
                              {problem.category}
                            </td>

                            <td>
                              {problem.location}
                            </td>

                            <td>

                              <span
                                className={`severity-badge ${getSeverityClass(
                                  analysis.severity
                                )}`}
                              >
                                {analysis.severity ||
                                  "Unknown"}
                              </span>

                            </td>

                            <td>
                              {analysis.urgency ||
                                problem.urgency}
                            </td>

                            <td>

                              <span className="status-badge">
                                {problem.status}
                              </span>

                            </td>

                          </tr>
                        );
                      })}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

          </>
        )}

      </main>

    </div>
  );
}

export default Home;