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
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          throw new Error("You must be logged in.");
        }

        const { data: solutionData, error: solutionError } =
          await supabase
            .from("solutions")
            .select("*")
            .eq("university_id", session.user.id)
            .order("created_at", {
              ascending: false,
            });

        if (solutionError) {
          throw solutionError;
        }

        const solutionsList = solutionData || [];

        if (solutionsList.length === 0) {
          setSolutions([]);
          return;
        }

        const problemIds = [
          ...new Set(
            solutionsList
              .map((solution) => solution.problem_id)
              .filter(Boolean)
          ),
        ];

        const { data: problemData, error: problemError } =
          await supabase
            .from("problems")
            .select(
              "id, title, category, location, priority_rank"
            )
            .in("id", problemIds);

        if (problemError) {
          throw problemError;
        }

        const problems = problemData || [];

        const combinedSolutions = solutionsList.map(
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
        setError("Unable to load your solutions.");
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

    return `solution-status-${currentStatus}`;
  };

  return (
    <div className="university-solutions-page">

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

      <main className="university-solutions-content">

        <div className="solutions-header">

          <div>

            <p className="solutions-label">
              SOLUTION WORKSPACE
            </p>

            <h1>
              University Solutions
            </h1>

            <p>
              Track the solutions your university has
              submitted for government-approved civic
              problems.
            </p>

          </div>

          <div className="solution-count">

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
            <div className="solution-statistics">

              <div className="solution-stat-card">

                <span>
                  Total Solutions
                </span>

                <strong>
                  {solutions.length}
                </strong>

                <small>
                  Created by your university
                </small>

              </div>

              <div className="solution-stat-card">

                <span>
                  Submitted
                </span>

                <strong>
                  {submittedCount}
                </strong>

                <small>
                  Awaiting government review
                </small>

              </div>

              <div className="solution-stat-card">

                <span>
                  Approved
                </span>

                <strong>
                  {approvedCount}
                </strong>

                <small>
                  Approved by government
                </small>

              </div>

              <div className="solution-stat-card">

                <span>
                  Rejected
                </span>

                <strong>
                  {rejectedCount}
                </strong>

                <small>
                  Needs revision
                </small>

              </div>

            </div>
          )}

        {!loading &&
          !error &&
          solutions.length > 0 && (
            <div className="solution-filters">

              <input
                type="text"
                placeholder="Search solutions or problems..."
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
                  Submitted
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
          <div className="solutions-message">
            Loading your solutions...
          </div>
        )}

        {!loading && error && (
          <div className="solutions-error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          solutions.length === 0 && (
            <div className="empty-solutions">

              <h2>
                No solutions submitted yet
              </h2>

              <p>
                Solutions developed for approved civic
                problems will appear here after submission.
              </p>

              <Link
                to="/university/problems"
                className="browse-problems-button"
              >
                Browse Approved Problems
              </Link>

            </div>
          )}

        {!loading &&
          !error &&
          solutions.length > 0 &&
          filteredSolutions.length === 0 && (
            <div className="empty-solutions">

              <h2>
                No matching solutions
              </h2>

              <p>
                Try changing your search or status filter.
              </p>

              <button
                className="clear-solution-filter"
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
            <div className="solutions-list">

              <div className="solutions-results-heading">

                <span>
                  Showing {filteredSolutions.length} of{" "}
                  {solutions.length} solutions
                </span>

              </div>

              {filteredSolutions.map((solution) => {

                const problem = solution.problem || {};

                return (
                  <div
                    className="solution-card"
                    key={solution.id}
                  >

                    <div className="solution-card-top">

                      <div>

                        <span className="solution-problem-label">
                          CIVIC PROBLEM
                        </span>

                        <h2>
                          {solution.title}
                        </h2>

                        <p className="linked-problem">
                          Problem:{" "}
                          {problem.title ||
                            "Problem information unavailable"}
                        </p>

                      </div>

                      <span
                        className={`solution-status ${getStatusClass(
                          solution.status
                        )}`}
                      >
                        {solution.status ||
                          "Submitted"}
                      </span>

                    </div>

                    <p className="solution-description">
                      {solution.description}
                    </p>

                    <div className="solution-details">

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
                          Priority
                        </span>

                        <strong>
                          #{problem.priority_rank ||
                            "N/A"}
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

                    <div className="solution-card-bottom">

                      <span>
                        Government Review
                      </span>

                      <span className="review-status">
                        {solution.status ===
                        "approved"
                          ? "Approved"
                          : solution.status ===
                            "rejected"
                          ? "Revision Required"
                          : "Awaiting Review"}
                      </span>

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