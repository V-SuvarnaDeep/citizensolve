import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const [problemCount, setProblemCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/university/problems"
        );

        if (!response.ok) {
          throw new Error("Unable to load problems");
        }

        const data = await response.json();

        setProblemCount(
          data.problems ? data.problems.length : 0
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProblems();
  }, []);

  return (
    <div className="university-page">

      {/* UNIVERSITY NAVBAR */}

      <nav className="university-navbar">

        <Link
          to="/university"
          className="university-logo"
        >
          CIVIORA
        </Link>

        <div className="university-nav-links">

          <Link
            to="/university"
            className="active"
          >
            Dashboard
          </Link>

          <Link to="/university/problems">
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

      {/* DASHBOARD */}

      <main className="university-home">

        <div className="university-home-header">

          <div>

            <p className="home-label">
              UNIVERSITY WORKSPACE
            </p>

            <h1>
              Turn civic problems into
              <span> meaningful solutions.</span>
            </h1>

            <p className="home-description">
              Explore Government-approved civic problems,
              develop innovative solutions and submit them
              for Government review.
            </p>

          </div>

          <Link
            to="/university/problems"
            className="explore-button"
          >
            Explore Problems
          </Link>

        </div>

        <div className="university-stats">

          <div className="university-stat-card">

            <div className="stat-icon">
              +
            </div>

            <div>
              <span>Approved Problems</span>

              <strong>
                {loading ? "..." : problemCount}
              </strong>
            </div>

          </div>

          <div className="university-stat-card">

            <div className="stat-icon">
              ◷
            </div>

            <div>
              <span>Solutions in Progress</span>

              <strong>
                0
              </strong>
            </div>

          </div>

          <div className="university-stat-card">

            <div className="stat-icon">
              ✓
            </div>

            <div>
              <span>Solutions Submitted</span>

              <strong>
                0
              </strong>
            </div>

          </div>

          <div className="university-stat-card">

            <div className="stat-icon">
              ●
            </div>

            <div>
              <span>Meetings</span>

              <strong>
                0
              </strong>
            </div>

          </div>

        </div>

        <section className="university-workflow">

          <div className="section-heading">

            <div>
              <p className="section-label">
                UNIVERSITY WORKFLOW
              </p>

              <h2>
                From problem to implementation
              </h2>
            </div>

          </div>

          <div className="workflow-line">

            <div className="workflow-card">

              <div className="workflow-number">
                01
              </div>

              <h3>
                Explore Problems
              </h3>

              <p>
                View civic problems that have been
                reviewed and approved by the Government.
              </p>

            </div>

            <div className="workflow-card">

              <div className="workflow-number">
                02
              </div>

              <h3>
                Develop a Solution
              </h3>

              <p>
                Use your university's expertise and
                resources to develop a practical solution.
              </p>

            </div>

            <div className="workflow-card">

              <div className="workflow-number">
                03
              </div>

              <h3>
                Submit for Review
              </h3>

              <p>
                Submit the completed solution to the
                Government for technical review.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Home;