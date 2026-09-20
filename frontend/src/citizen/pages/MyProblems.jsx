import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Plus,
  Search,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import "./MyProblems.css";

function MyProblems() {
  const [problems, setProblems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProblems = async () => {
      try {
        setLoading(true);
        setError("");

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setError(
            "Your session has expired. Please sign in again."
          );
          return;
        }

        const response = await fetch(
          "http://127.0.0.1:8000/citizen/problems",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Your session is no longer valid. Please sign in again."
            );
          }

          throw new Error(
            "Unable to load your submitted problems."
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            "Unable to load your submitted problems."
          );
        }

        setProblems(result.problems || []);

      } catch (err) {
        console.error("Loading problems error:", err);

        setError(
          err.message ||
            "Something went wrong while loading your problems."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProblems();
  }, []);

  const filteredProblems = problems.filter((problem) => {
    const search = searchText.toLowerCase();

    return (
      problem.title?.toLowerCase().includes(search) ||
      problem.category?.toLowerCase().includes(search) ||
      problem.location?.toLowerCase().includes(search)
    );
  });

  const getStatusText = (status) => {
    if (status === "approved") {
      return "Approved";
    }

    if (status === "rejected") {
      return "Rejected";
    }

    if (status === "submitted") {
      return "Under Review";
    }

    return status || "Submitted";
  };

  const getStatusClass = (status) => {
    if (status === "approved") {
      return "approved-status";
    }

    if (status === "rejected") {
      return "rejected-status";
    }

    return "submitted-status";
  };

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
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
    <div className="my-problems-page">

      {/* Navbar */}
      <nav className="problems-navbar">

        <Link
          to="/citizen"
          className="problems-logo"
        >
          Civiora
        </Link>

        <div className="problems-nav-links">

          <Link to="/citizen">
            Home
          </Link>

          <Link to="/citizen/submit">
            Submit Problem
          </Link>

          <Link
            to="/citizen/problems"
            className="active"
          >
            My Problems
          </Link>

          <Link to="/citizen/notifications">
            <Bell size={18} />
            Notifications
          </Link>

          <Link to="/citizen/settings">
            Settings
          </Link>

        </div>

      </nav>

      {/* Main Content */}
      <main className="problems-content">

        <div className="problems-top">

          <div>

            <Link
              to="/citizen"
              className="back-link"
            >
              <ArrowLeft size={18} />
              Back to Home
            </Link>

            <h1>
              My Problems
            </h1>

            <p>
              Track the societal problems you have
              submitted through Civiora.
            </p>

          </div>

          <Link
            to="/citizen/submit"
            className="submit-problem-button"
          >
            <Plus size={19} />
            Submit New Problem
          </Link>

        </div>

        {/* Search */}
        <div className="problem-search">

          <Search size={19} />

          <input
            type="text"
            placeholder="Search your problems..."
            value={searchText}
            onChange={(e) =>
              setSearchText(e.target.value)
            }
          />

        </div>

        {/* Problems */}
        <section className="problems-section">

          <div className="section-heading">

            <h2>
              Submitted Problems
            </h2>

            <span>
              {filteredProblems.length} Problems
            </span>

          </div>

          {loading && (
            <div className="problem-message">
              Loading your problems...
            </div>
          )}

          {!loading && error && (
            <div className="problem-message error-message">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            filteredProblems.length === 0 && (
              <div className="problem-message">
                {searchText
                  ? "No problems match your search."
                  : "You have not submitted any problems yet."}
              </div>
            )}

          {!loading &&
            !error &&
            filteredProblems.length > 0 && (

              <div className="problems-list">

                {filteredProblems.map((problem) => (

                  <div
                    className="problem-card"
                    key={problem.id}
                  >

                    <div className="problem-card-top">

                      <div>

                        <h3>
                          {problem.title}
                        </h3>

                        <div className="problem-details">

                          <span>
                            {problem.category}
                          </span>

                          <span>
                            {problem.location}
                          </span>

                          <span>
                            Submitted:{" "}
                            {formatDate(
                              problem.created_at
                            )}
                          </span>

                        </div>

                      </div>

                      <span
                        className={`problem-status ${getStatusClass(
                          problem.status
                        )}`}
                      >
                        {getStatusText(
                          problem.status
                        )}
                      </span>

                    </div>

                    <div className="problem-card-bottom">

                      <p>
                        {problem.ai_analysis?.summary ||
                          "Your problem has been received and is being processed by the Civiora platform."}
                      </p>

                      <button
                        className="view-problem-button"
                        type="button"
                      >
                        View Details
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

        </section>

      </main>

      {/* Footer */}
      <footer className="problems-footer">

        <p>
          © 2026 Civiora. Connecting citizens,
          institutions and solutions.
        </p>

      </footer>

    </div>
  );
}

export default MyProblems;