import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Bell, Plus, Search } from "lucide-react";
import "./MyProblems.css";

function MyProblems() {
  const problems = [
    {
      id: 1,
      title: "Poor Street Lighting in Residential Area",
      category: "Infrastructure",
      location: "Hyderabad",
      status: "Under Review",
      submittedOn: "02 Sep 2026",
    },
    {
      id: 2,
      title: "Garbage Collection Delay",
      category: "Sanitation",
      location: "Hyderabad",
      status: "Submitted",
      submittedOn: "30 Aug 2026",
    },
  ];

  return (
    <div className="my-problems-page">
      {/* Navbar */}
      <nav className="problems-navbar">
        <Link to="/citizen" className="problems-logo">
          Civiora
        </Link>

        <div className="problems-nav-links">
          <Link to="/citizen">Home</Link>
          <Link to="/citizen/submit">Submit Problem</Link>
          <Link to="/citizen/problems" className="active">
            My Problems
          </Link>
          <Link to="/citizen/notifications">
            <Bell size={18} />
            Notifications
          </Link>
          <Link to="/citizen/settings">Settings</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="problems-content">
        <div className="problems-top">
          <div>
            <Link to="/citizen" className="back-link">
              <ArrowLeft size={18} />
              Back to Home
            </Link>

            <h1>My Problems</h1>
            <p>
              Track the societal problems you have submitted through Civiora.
            </p>
          </div>

          <Link to="/citizen/submit" className="submit-problem-button">
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
          />
        </div>

        {/* Problems */}
        <section className="problems-section">
          <div className="section-heading">
            <h2>Submitted Problems</h2>
            <span>{problems.length} Problems</span>
          </div>

          <div className="problems-list">
            {problems.map((problem) => (
              <div className="problem-card" key={problem.id}>
                <div className="problem-card-top">
                  <div>
                    <h3>{problem.title}</h3>

                    <div className="problem-details">
                      <span>{problem.category}</span>
                      <span>{problem.location}</span>
                      <span>Submitted: {problem.submittedOn}</span>
                    </div>
                  </div>

                  <span
                    className={`problem-status ${
                      problem.status === "Under Review"
                        ? "review-status"
                        : "submitted-status"
                    }`}
                  >
                    {problem.status}
                  </span>
                </div>

                <div className="problem-card-bottom">
                  <p>
                    Your problem has been received and is being processed by
                    the Civiora platform.
                  </p>

                  <button className="view-problem-button">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="problems-footer">
        <p>© 2026 Civiora. Connecting citizens, institutions and solutions.</p>
      </footer>
    </div>
  );
}

export default MyProblems;