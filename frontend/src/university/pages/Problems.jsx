import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../../api";
import "./Problems.css";

function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [severity, setSeverity] = useState("all");

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const response = await fetch(
          `${API_URL}/university/problems`
        );

        if (!response.ok) {
          throw new Error("Unable to load approved problems");
        }

        const data = await response.json();

        setProblems(data.problems || []);
      } catch (error) {
        console.error(error);
        setError("Unable to load approved problems.");
      } finally {
        setLoading(false);
      }
    };

    loadProblems();
  }, []);

  const categories = useMemo(() => {
    const values = problems
      .map((problem) => problem.category)
      .filter(Boolean);

    return [...new Set(values)];
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const analysis = problem.ai_analysis || {};

      const searchText = search.toLowerCase();

      const matchesSearch =
        !searchText ||
        (problem.title || "")
          .toLowerCase()
          .includes(searchText) ||
        (problem.description || "")
          .toLowerCase()
          .includes(searchText) ||
        (problem.location || "")
          .toLowerCase()
          .includes(searchText) ||
        (problem.category || "")
          .toLowerCase()
          .includes(searchText);

      const matchesCategory =
        category === "all" ||
        (problem.category || "").toLowerCase() ===
          category.toLowerCase();

      const problemSeverity = (
        analysis.severity || ""
      ).toLowerCase();

      const matchesSeverity =
        severity === "all" ||
        problemSeverity === severity.toLowerCase();

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSeverity
      );
    });
  }, [problems, search, category, severity]);

  const criticalCount = problems.filter(
    (problem) =>
      (problem.ai_analysis?.severity || "").toLowerCase() ===
      "critical"
  ).length;

  const highCount = problems.filter(
    (problem) =>
      (problem.ai_analysis?.severity || "").toLowerCase() ===
      "high"
  ).length;

  const mediumCount = problems.filter(
    (problem) =>
      (problem.ai_analysis?.severity || "").toLowerCase() ===
      "medium"
  ).length;

  const getSeverityClass = (value) => {
    const currentSeverity = (
      value || "medium"
    ).toLowerCase();

    return `severity-${currentSeverity}`;
  };

  return (
    <div className="university-problems-page">

      {/* NAVBAR */}

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

      {/* CONTENT */}

      <main className="university-problems-content">

        {/* HEADER */}

        <div className="problems-header">

          <div>

            <p className="problems-label">
              CIVIC PROBLEM QUEUE
            </p>

            <h1>
              Government Approved Problems
            </h1>

            <p>
              Explore civic problems that have been
              reviewed and approved by the Government
              for university solution development.
            </p>

          </div>

          <div className="problem-count">

            <strong>
              {loading ? "..." : problems.length}
            </strong>

            <span>
              Approved Problems
            </span>

          </div>

        </div>

        {/* STATISTICS */}

        {!loading && !error && problems.length > 0 && (

          <div className="problem-statistics">

            <div className="problem-stat-card">

              <span className="stat-title">
                Total Approved
              </span>

              <strong>
                {problems.length}
              </strong>

              <small>
                Available for development
              </small>

            </div>

            <div className="problem-stat-card">

              <span className="stat-title">
                Critical
              </span>

              <strong>
                {criticalCount}
              </strong>

              <small>
                Highest severity
              </small>

            </div>

            <div className="problem-stat-card">

              <span className="stat-title">
                High
              </span>

              <strong>
                {highCount}
              </strong>

              <small>
                High severity
              </small>

            </div>

            <div className="problem-stat-card">

              <span className="stat-title">
                Medium
              </span>

              <strong>
                {mediumCount}
              </strong>

              <small>
                Medium severity
              </small>

            </div>

          </div>

        )}

        {/* FILTERS */}

        {!loading && !error && problems.length > 0 && (

          <div className="problem-filters">

            <div className="search-box">

              <input
                type="text"
                placeholder="Search problems, locations or categories..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

            </div>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >

              <option value="all">
                All Categories
              </option>

              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}

            </select>

            <select
              value={severity}
              onChange={(event) =>
                setSeverity(event.target.value)
              }
            >

              <option value="all">
                All Severity
              </option>

              <option value="critical">
                Critical
              </option>

              <option value="high">
                High
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="low">
                Low
              </option>

            </select>

          </div>

        )}

        {/* LOADING */}

        {loading && (

          <div className="problems-message">
            Loading approved problems...
          </div>

        )}

        {/* ERROR */}

        {!loading && error && (

          <div className="problems-error">
            {error}
          </div>

        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          problems.length === 0 && (

            <div className="empty-problems">

              <h2>
                No approved problems yet
              </h2>

              <p>
                Government-approved problems will appear
                here when they are available for university
                teams.
              </p>

            </div>

          )}

        {/* NO FILTER RESULTS */}

        {!loading &&
          !error &&
          problems.length > 0 &&
          filteredProblems.length === 0 && (

            <div className="empty-problems">

              <h2>
                No matching problems
              </h2>

              <p>
                Try changing your search or filters to
                find other approved problems.
              </p>

              <button
                className="clear-filter-button"
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                  setSeverity("all");
                }}
              >
                Clear Filters
              </button>

            </div>

          )}

        {/* PROBLEMS */}

        {!loading &&
          !error &&
          filteredProblems.length > 0 && (

            <div className="problems-list">

              <div className="results-heading">

                <span>
                  Showing {filteredProblems.length} of{" "}
                  {problems.length} problems
                </span>

                <span>
                  Ordered by AI priority
                </span>

              </div>

              {filteredProblems.map((problem) => {

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
                        Government Approved
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