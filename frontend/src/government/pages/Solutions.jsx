import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./Solutions.css";
import "./GovernmentNavbar.css";

function Solutions() {
  const [solutions, setSolutions] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSolutions();
  }, []);

  const loadSolutions = async () => {
    try {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("solutions")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      const solutionData = data || [];

      const problemIds = [
        ...new Set(
          solutionData
            .map((solution) => solution.problem_id)
            .filter(Boolean)
        ),
      ];

      let problems = [];

      if (problemIds.length > 0) {
        const { data: problemData, error: problemError } =
          await supabase
            .from("problems")
            .select(
              "id, title, description, category, location"
            )
            .in("id", problemIds);

        if (problemError) {
          throw problemError;
        }

        problems = problemData || [];
      }

      const combinedSolutions = solutionData.map(
        (solution) => ({
          ...solution,
          problem:
            problems.find(
              (problem) =>
                problem.id === solution.problem_id
            ) || null,
        })
      );

      setSolutions(combinedSolutions);
    } catch (err) {
      console.error(err);
      setError("Unable to load government solutions.");
    } finally {
      setLoading(false);
    }
  };

  const filteredSolutions = useMemo(() => {
    return solutions.filter((solution) => {
      const searchText = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        !searchText ||
        String(
          solution.title ||
            solution.solution_title ||
            ""
        )
          .toLowerCase()
          .includes(searchText) ||
        String(
          solution.description || ""
        )
          .toLowerCase()
          .includes(searchText) ||
        String(
          solution.problem?.title || ""
        )
          .toLowerCase()
          .includes(searchText);

      const solutionStatus = String(
        solution.status || ""
      ).toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        solutionStatus ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [solutions, search, statusFilter]);

  const approvedSolutions = solutions.filter(
    (solution) =>
      String(solution.status || "").toLowerCase() ===
      "approved"
  ).length;

  const pendingSolutions = solutions.filter(
    (solution) => {
      const status = String(
        solution.status || ""
      ).toLowerCase();

      return (
        status === "pending" ||
        status === "submitted" ||
        status === "under_review"
      );
    }
  ).length;

  const rejectedSolutions = solutions.filter(
    (solution) =>
      String(solution.status || "").toLowerCase() ===
      "rejected"
  ).length;

  const getStatusClass = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (value === "approved") {
      return "solution-status approved";
    }

    if (
      value === "pending" ||
      value === "submitted" ||
      value === "under_review"
    ) {
      return "solution-status pending";
    }

    if (value === "rejected") {
      return "solution-status rejected";
    }

    return "solution-status";
  };

  const getStatusText = (status) => {
    if (!status) {
      return "Pending";
    }

    return String(status)
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="government-solutions-page">

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

          <Link to="/government/problems">
            Problems
          </Link>

          <Link
            to="/government/solutions"
            className="active"
          >
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

      <main className="government-solutions-content">

        <div className="solutions-header">

          <div>

            <p className="solutions-label">
              GOVERNMENT WORKSPACE
            </p>

            <h1 className="solutions-title">
              Solutions
            </h1>

            <p className="solutions-subtitle">
              Review solutions developed by universities for approved civic problems.
            </p>

          </div>

          <button
            className="solutions-refresh-button"
            onClick={loadSolutions}
          >
            Refresh
          </button>

        </div>


        {/* STATS */}

        <div className="solution-stats">

          <div className="solution-stat-card">

            <span>
              TOTAL SOLUTIONS
            </span>

            <strong>
              {solutions.length}
            </strong>

          </div>


          <div className="solution-stat-card">

            <span>
              AWAITING REVIEW
            </span>

            <strong>
              {pendingSolutions}
            </strong>

          </div>


          <div className="solution-stat-card">

            <span>
              APPROVED
            </span>

            <strong className="approved-number">
              {approvedSolutions}
            </strong>

          </div>


          <div className="solution-stat-card">

            <span>
              REJECTED
            </span>

            <strong className="rejected-number">
              {rejectedSolutions}
            </strong>

          </div>

        </div>


        {/* FILTERS */}

        <div className="solutions-filters">

          <div className="solution-search">

            <input
              type="text"
              placeholder="Search solutions or problems..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>


          <div className="solution-status-filter">

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="all">
                All Status
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="submitted">
                Submitted
              </option>

              <option value="under_review">
                Under Review
              </option>

              <option value="approved">
                Approved
              </option>

              <option value="rejected">
                Rejected
              </option>
            </select>

          </div>

        </div>


        {/* LOADING */}

        {loading && (
          <div className="solutions-message">
            Loading solutions...
          </div>
        )}


        {/* ERROR */}

        {!loading && error && (
          <div className="solutions-error">
            {error}
          </div>
        )}


        {/* EMPTY */}

        {!loading &&
          !error &&
          filteredSolutions.length === 0 && (

          <div className="solutions-empty">

            <div className="solutions-empty-icon">
              ✓
            </div>

            <h2>
              No solutions found
            </h2>

            <p>
              {solutions.length === 0
                ? "University solutions will appear here after approved problems are assigned."
                : "Try changing your search or status filter."}
            </p>

          </div>
        )}


        {/* SOLUTION LIST */}

        {!loading &&
          !error &&
          filteredSolutions.length > 0 && (

          <div className="solutions-list">

            {filteredSolutions.map(
              (solution) => (

                <div
                  className="solution-card"
                  key={solution.id}
                >

                  <div className="solution-card-top">

                    <div>

                      <span className="solution-card-label">
                        UNIVERSITY SOLUTION
                      </span>

                      <h2>
                        {solution.title ||
                          solution.solution_title ||
                          "Untitled Solution"}
                      </h2>

                    </div>

                    <span
                      className={getStatusClass(
                        solution.status
                      )}
                    >
                      {getStatusText(
                        solution.status
                      )}
                    </span>

                  </div>


                  <div className="solution-description">

                    <p>
                      {solution.description ||
                        "No solution description available."}
                    </p>

                  </div>


                  <div className="solution-problem">

                    <span>
                      RELATED CIVIC PROBLEM
                    </span>

                    <strong>
                      {solution.problem?.title ||
                        "Problem information unavailable"}
                    </strong>

                    {solution.problem?.location && (
                      <small>
                        {solution.problem.location}
                      </small>
                    )}

                  </div>


                  <div className="solution-card-footer">

                    <div className="solution-meta">

                      <span>
                        SUBMITTED
                      </span>

                      <strong>
                        {formatDate(
                          solution.created_at
                        )}
                      </strong>

                    </div>


                    <Link
                      to={`/government/solutions/${solution.id}`}
                      className="solution-review-button"
                    >
                      Review Solution
                    </Link>

                  </div>

                </div>

              )
            )}

          </div>
        )}

      </main>

    </div>
  );
}

export default Solutions;