import React from "react";
import { Link } from "react-router-dom";
import "./Meetings.css";

function Meetings() {
  return (
    <div className="meetings-page">

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

          <Link to="/university/problems">
            Problems
          </Link>

          <Link to="/university/solutions">
            Solutions
          </Link>

          <Link
            to="/university/meetings"
            className="active"
          >
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

      {/* MEETINGS */}

      <main className="meetings-content">

        <div className="meetings-header">

          <div>

            <p className="meetings-label">
              UNIVERSITY MEETINGS
            </p>

            <h1>
              Meetings
            </h1>

            <p className="meetings-description">
              View and manage meetings related to your
              university solutions.
            </p>

          </div>

        </div>

        <section className="meetings-empty-card">

          <div className="meetings-empty-icon">
            📅
          </div>

          <h2>
            No Meetings Scheduled
          </h2>

          <p>
            Meetings will appear here after your solution
            is approved by the Government and a company
            is matched for implementation.
          </p>

          <div className="meeting-flow">

            <div className="flow-step">

              <span>1</span>

              <strong>
                Submit Solution
              </strong>

              <small>
                University develops and submits a solution.
              </small>

            </div>

            <div className="flow-line"></div>

            <div className="flow-step">

              <span>2</span>

              <strong>
                Government Review
              </strong>

              <small>
                Government reviews and approves the solution.
              </small>

            </div>

            <div className="flow-line"></div>

            <div className="flow-step">

              <span>3</span>

              <strong>
                Company Matching
              </strong>

              <small>
                Civiora identifies a suitable company.
              </small>

            </div>

            <div className="flow-line"></div>

            <div className="flow-step">

              <span>4</span>

              <strong>
                Meeting
              </strong>

              <small>
                A meeting is scheduled for collaboration.
              </small>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Meetings;