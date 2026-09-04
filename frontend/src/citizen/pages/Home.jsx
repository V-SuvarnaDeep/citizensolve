import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  CheckCircle,
  Clock,
  FileText,
  Plus,
} from "lucide-react";
import "./Home.css";

function Home() {
  return (
    <div className="citizen-home">

      {/* Navbar */}
      <nav className="citizen-navbar">
      <Link to="/citizen" className="citizen-brand">
  CIVIORA
</Link>

        <div className="citizen-nav-links">
          
         <Link
              to="/citizen/submit"
              className="citizen-primary-button"
          >
           <Plus size={19} />
           Submit a Problem
         </Link>
          <Link to="/citizen/myproblems">
            My Problems
          </Link>
          <Link to="/citizen/notifications">
            Notifications
          </Link>
          <Link to="/citizen/settings">
            Settings
          </Link>
        </div>

        <Link to="/login" className="citizen-logout">
          Logout
        </Link>
      </nav>

      <main className="citizen-main">

        {/* Welcome */}
        <section className="citizen-welcome">

          <div>
            <span className="citizen-label">
              CITIZEN WORKSPACE
            </span>

            <h1>
              Turn your problem
              <span> into a possibility.</span>
            </h1>

            <p>
              Submit a societal problem and let Civiora connect it with the
              right expertise, institutions and implementation partners.
            </p>
          </div>

          <Link
            to="/citizen/submit"
            className="citizen-primary-button"
          >
            <Plus size={25} />
            Submit a Problem
          </Link>

        </section>

        {/* Stats */}
        <section className="citizen-stats">

          <div className="citizen-stat-card">
            <div className="stat-icon">
              <FileText size={21} />
            </div>

            <div>
              <span>Total Problems</span>
              <strong>0</strong>
            </div>
          </div>

          <div className="citizen-stat-card">
            <div className="stat-icon">
              <Clock size={21} />
            </div>

            <div>
              <span>Under Analysis</span>
              <strong>0</strong>
            </div>
          </div>

          <div className="citizen-stat-card">
            <div className="stat-icon">
              <CheckCircle size={21} />
            </div>

            <div>
              <span>Solutions Developed</span>
              <strong>0</strong>
            </div>
          </div>

          <div className="citizen-stat-card">
            <div className="stat-icon">
              <Bell size={21} />
            </div>

            <div>
              <span>Notifications</span>
              <strong>0</strong>
            </div>
          </div>

        </section>

        {/* Recent Problems */}
        <section className="recent-problems">

          <div className="section-title-row">

            <div>
              <span className="citizen-label">
                YOUR ACTIVITY
              </span>

              <h2>Recent Problems</h2>
            </div>

            <Link to="/citizen/problems">
  View All
  <ArrowRight size={16} />
</Link>
          </div>

          <div className="empty-problems">

            <div className="empty-icon">
              <FileText size={28} />
            </div>

            <h3>No problems submitted yet</h3>

            <p>
              Your submitted societal problems will appear here once you
              start using Civiora.
            </p>

            <Link
  to="/citizen/submit"
  className="citizen-secondary-button"
>
  Submit Your First Problem
  <ArrowRight size={17} />
</Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Home;