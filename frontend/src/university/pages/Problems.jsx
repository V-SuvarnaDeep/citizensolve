import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./Problems.css";

function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const {
          data: { session }
        } = await supabase.auth.getSession();

        if (!session) {
          throw new Error("University session not found");
        }

        const response = await fetch(
          "http://127.0.0.1:8000/university/problems",
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Unable to load allocated problems");
        }

        const data = await response.json();

        setProblems(data.problems || []);
      } catch (error) {
        console.error(error);
        setError("Unable to load allocated problems.");
      } finally {
        setLoading(false);
      }
    };

    loadProblems();
  }, []);

  const getSeverityClass = (severity) => {
    if (!severity) {
      return "severity-medium";
    }

    return `severity-${severity.toLowerCase()}`;
  };

  return (
    <div className="university-problems-page">

      {/* UNIVERSITY NAVBAR */}

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

      {/* PAGE CONTENT */}

      <main className="university-problems-content">

        <div className="problems-header">

          <div>

            <p className="problems-label">
              CIVIC PROBLEM QUEUE
            </p>

            <h1>
              Allocated Civic Problems
            </h1>

            <p>
              Explore civic problems that have been reviewed
              and approved by the Government and allocated
              to your university by Civiora AI.
            </p>

          </div>

          <div className="problem-count">

            <strong>
              {loading ? "..." : problems.length}
            </strong>

            <span>
              Assigned Problems
            </span>

          </div>

        </div>

        {loading && (
          <div className="problems-message">
            Loading allocated problems...
          </div>
        )}

        {!loading && error && (
          <div className="problems-error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          problems.length === 0 && (

            <div className="empty-problems">

              <h2>
                No problems assigned yet
              </h2>

              <p>
                Government-approved problems allocated
                to your university will appear here.
              </p>

            </div>
          )}

        {!loading &&
          !error &&
          problems.length > 0 && (

            <div className="problems-list">

              {problems.map((problem) => {

                const analysis =
                  problem.ai_analysis || {};

                return (

                  <div
                    className="problem-card"
                    key={problem.id}
                  >

                    <div className="problem-card-top">

                      <div>

                        <span className="priority-badge">
                          Priority #{problem.priority_rank}
                        </span>

                        <h2>
                          {problem.title}
                        </h2>

                      </div>

                      <span
                        className={`severity-badge ${getSeverityClass(
                          analysis.severity
                        )}`}
                      >
                        {analysis.severity || "Medium"}
                      </span>

                    </div>

                    <p className="problem-description">
                      {problem.description}
                    </p>

                    <div className="problem-details">

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
                          Urgency
                        </span>

                        <strong>
                          {analysis.urgency ||
                            problem.urgency ||
                            "N/A"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Affected Population
                        </span>

                        <strong>
                          {analysis.affectedPopulation ||
                            "N/A"}
                        </strong>
                      </div>

                    </div>

                    {analysis.summary && (

                      <div className="ai-summary">

                        <span>
                          AI Summary
                        </span>

                        <p>
                          {analysis.summary}
                        </p>

                      </div>

                    )}

                    <div className="problem-card-bottom">

                      <span className="approved-status">
                        AI Allocated
                      </span>

                      <Link
                        to={`/university/problems/${problem.id}`}
                        className="view-problem-button"
                      >
                        View Problem
                      </Link>

                    </div>

                  </div>

                );

              })}

            </div>

          )}

      </main>

    </div>
  );
}

export default Problems;