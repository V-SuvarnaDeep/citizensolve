import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./Solutions.css";

function Solutions() {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const loadSolutions = async () => {
      try {
        const { data, error } = await supabase
          .from("solutions")
          .select("*")
          .order("created_at", {
            ascending: false,
          });

        if (error) {
          throw error;
        }

        const solutionList = data || [];

        if (solutionList.length === 0) {
          setSolutions([]);
          return;
        }

        const problemIds = [
          ...new Set(
            solutionList
              .map((solution) => solution.problem_id)
              .filter(Boolean)
          ),
        ];

        const {
          data: problemData,
          error: problemError,
        } = await supabase
          .from("problems")
          .select(
            "id, title, category, location, priority_rank, status"
          )
          .in("id", problemIds);

        if (problemError) {
          throw problemError;
        }

        const problems = problemData || [];

        const combinedSolutions = solutionList.map(
          (solution) => {
            const problem = problems.find(
              (item) => item.id === solution.problem_id
            );

            return {
              ...solution,
              problem: problem || null,
            };
          }
        );

        setSolutions(combinedSolutions);
      } catch (error) {
        console.error(error);
        setError("Unable to load submitted solutions.");
      } finally {
        setLoading(false);
      }
    };

    loadSolutions();
  }, []);

  const filteredSolutions = useMemo(() => {
    return solutions.filter((solution) => {
      const searchText = search.toLowerCase();

      const problem = solution.problem || {};

      const matchesSearch =
        !searchText ||
        (solution.title || "")
          .toLowerCase()
          .includes(searchText) ||
        (solution.description || "")
          .toLowerCase()
          .includes(searchText) ||
        (problem.title || "")
          .toLowerCase()
          .includes(searchText) ||
        (problem.category || "")
          .toLowerCase()
          .includes(searchText) ||
        (problem.location || "")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        (solution.status || "").toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [solutions, search, statusFilter]);

  const submittedCount = solutions.filter(
    (solution) => solution.status === "submitted"
  ).length;

  const approvedCount = solutions.filter(
    (solution) => solution.status === "approved"
  ).length;

  const rejectedCount = solutions.filter(
    (solution) => solution.status === "rejected"
  ).length;

  const getStatusClass = (status) => {
    const currentStatus = (
      status || "submitted"
    ).toLowerCase();

    return `government-solution-${currentStatus}`;
  };

  return (
    <div className="government-solutions-page">

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
            Dashboard
          </Link>

          <Link to="/government">
            Problems
          </Link>

          <Link
            to="/government/solutions"
            className="active"
          >
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

      {/* PAGE CONTENT */}

      <main className="government-solutions-content">

        <div className="government-solutions-header">

          <div>

            <p className="government-solutions-label">
              SOLUTION REVIEW
            </p>

            <h1>
              University Solutions
            </h1>

            <p>
              Review solutions submitted by universities
              for government-approved civic problems.
            </p>

          </div>

          <div className="government-solution-count">

            <strong>
              {loading ? "..." : solutions.length}
            </strong>

            <span>
              Total Solutions
            </span>

          </div>

        </div>

        {!loading &&
          !error &&
          solutions.length > 0 && (
            <div className="government-solution-statistics">

              <div className="government-solution-stat-card">

                <span>
                  Total
                </span>

                <strong>
                  {solutions.length}
                </strong>

                <small>
                  University submissions
                </small>

              </div>

              <div className="government-solution-stat-card">

                <span>
                  Awaiting Review
                </span>

                <strong>
                  {submittedCount}
                </strong>

                <small>
                  Need government decision
                </small>

              </div>

              <div className="government-solution-stat-card">

                <span>
                  Approved
                </span>

                <strong>
                  {approvedCount}
                </strong>

                <small>
                  Approved solutions
                </small>

              </div>

              <div className="government-solution-stat-card">

                <span>
                  Rejected
                </span>

                <strong>
                  {rejectedCount}
                </strong>

                <small>
                  Require revision
                </small>

              </div>

            </div>
          )}

        {!loading &&
          !error &&
          solutions.length > 0 && (
            <div className="government-solution-filters">

              <input
                type="text"
                placeholder="Search solutions, problems or locations..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >

                <option value="all">
                  All Status
                </option>

                <option value="submitted">
                  Awaiting Review
                </option>

                <option value="approved">
                  Approved
                </option>

                <option value="rejected">
                  Rejected
                </option>

              </select>

            </div>
          )}

        {loading && (
          <div className="government-solutions-message">
            Loading university solutions...
          </div>
        )}

        {!loading && error && (
          <div className="government-solutions-error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          solutions.length === 0 && (
            <div className="government-empty-solutions">

              <h2>
                No solutions submitted yet
              </h2>

              <p>
                University solutions will appear here
                after they are submitted for government
                review.
              </p>

            </div>
          )}

        {!loading &&
          !error &&
          solutions.length > 0 &&
          filteredSolutions.length === 0 && (
            <div className="government-empty-solutions">

              <h2>
                No matching solutions
              </h2>

              <p>
                Try changing your search or status filter.
              </p>

              <button
                className="clear-government-filter"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </button>

            </div>
          )}

        {!loading &&
          !error &&
          filteredSolutions.length > 0 && (
            <div className="government-solutions-list">

              <div className="government-results-heading">

                <span>
                  Showing {filteredSolutions.length} of{" "}
                  {solutions.length} solutions
                </span>

                <span>
                  Latest submissions first
                </span>

              </div>

              {filteredSolutions.map((solution) => {

                const problem = solution.problem || {};

                return (
                  <div
                    className="government-solution-card"
                    key={solution.id}
                  >

                    <div className="government-solution-card-top">

                      <div>

                        <span className="government-problem-label">
                          UNIVERSITY SOLUTION
                        </span>

                        <h2>
                          {solution.title}
                        </h2>

                        <p className="government-linked-problem">
                          Problem:{" "}
                          {problem.title ||
                            "Problem information unavailable"}
                        </p>

                      </div>

                      <span
                        className={`government-solution-status ${getStatusClass(
                          solution.status
                        )}`}
                      >
                        {solution.status === "submitted"
                          ? "Awaiting Review"
                          : solution.status ||
                            "Submitted"}
                      </span>

                    </div>

                    <p className="government-solution-description">
                      {solution.description}
                    </p>

                    <div className="government-solution-details">

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
                          Problem Priority
                        </span>

                        <strong>
                          #{problem.priority_rank || "N/A"}
                        </strong>

                      </div>

                      <div>

                        <span>
                          Submitted
                        </span>

                        <strong>
                          {solution.created_at
                            ? new Date(
                                solution.created_at
                              ).toLocaleDateString()
                            : "N/A"}
                        </strong>

                      </div>

                    </div>

                    <div className="government-solution-card-bottom">

                      <span>
                        Government Technical Review
                      </span>

                      <Link
                        to={`/government/solutions/${solution.id}`}
                        className="review-solution-button"
                      >
                        Review Solution →
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

export default Solutions;