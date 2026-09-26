import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_URL from "../../api";
import "./Home.css";
import "./GovernmentNavbar.css";

function Home() {
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

  const criticalProblems = problems.filter(
    (problem) =>
      String(
        problem.ai_analysis?.severity || ""
      ).toLowerCase() === "critical"
  );

  const submittedProblems = problems.filter(
    (problem) =>
      problem.status === "submitted"
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
            Home
          </Link>

          <Link to="/government/problems">
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

      {/* HOME CONTENT */}

      <main className="government-content">

        <div className="government-header">

          <div>

            <p className="government-label">
              GOVERNMENT WORKSPACE
            </p>

            <h1 className="government-title">
              Government Home
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

            {/* STATISTICS */}

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

            {/* HOME INFORMATION */}

            <div className="priority-section">

              <h2 className="section-title">
                Civiora Government Workflow
              </h2>

              <div className="dashboard-message">

                <p>
                  Civic problems submitted by citizens are
                  analyzed and prioritized by Civiora AI.
                  Government officials can review and validate
                  these problems before they proceed to the
                  university solution stage.
                </p>

                <Link
                  to="/government/problems"
                  className="overview-button"
                >
                  View AI Priority Queue
                </Link>

              </div>

            </div>

          </>
        )}

      </main>

    </div>
  );
}

export default Home;