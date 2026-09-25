import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  Building2,
  GraduationCap,
  Landmark,
  Users,
} from "lucide-react";
import "./Home.css";

function Home() {
  return (
    <div className="public-home">

      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          CIVIORA
        </Link>

        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/how-it-works">How It Works</Link>
        </div>

        <div className="navbar-actions">
          <Link to="/login" className="login-link">
            Login
          </Link>

          <Link to="/register" className="register-button">
            Get Started
            <ArrowRight size={17} />
          </Link>
        </div>
      </nav>

      <main>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">

            <div className="hero-badge">
              <Brain size={16} />
              AI-POWERED CIVIC INNOVATION
            </div>

            <h1>
              From Citizen
              <span> Problems </span>
              to Real-World
              <span> Solutions.</span>
            </h1>

            <p className="hero-description">
              Civiora connects citizens, artificial intelligence, universities,
              government and companies to transform societal problems into
              practical, implementable solutions.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="primary-button">
                Submit a Problem
                <ArrowRight size={19} />
              </Link>

              <Link to="/how-it-works" className="secondary-button">
                See How It Works
              </Link>
            </div>

            <div className="hero-network">

              <div className="network-item">
                <Users size={20} />
                <span>Citizen</span>
              </div>

              <ArrowRight className="network-arrow" size={18} />

              <div className="network-item ai-node">
                <Brain size={20} />
                <span>AI</span>
              </div>

              <ArrowRight className="network-arrow" size={18} />

              <div className="network-item">
                <GraduationCap size={20} />
                <span>University</span>
              </div>

              <ArrowRight className="network-arrow" size={18} />

              <div className="network-item">
                <Landmark size={20} />
                <span>Government</span>
              </div>

              <ArrowRight className="network-arrow" size={18} />

              <div className="network-item">
                <Building2 size={20} />
                <span>Company</span>
              </div>

            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="section-heading">

            <span className="section-label">
              THE CIVIORA MISSION
            </span>

            <h2>
              One problem.
              <br />
              Multiple possibilities.
            </h2>

            <p>
              Civiora creates a structured bridge between the people who
              identify societal challenges and the institutions capable of
              solving them.
            </p>

          </div>

          <div className="mission-cards">

            <div className="mission-card">
              <span>01</span>

              <h3>Identify</h3>

              <p>
                Citizens submit real-world problems that require meaningful
                solutions.
              </p>
            </div>

            <div className="mission-card">
              <span>02</span>

              <h3>Match</h3>

              <p>
                AI analyzes the challenge and identifies the best-fit
                universities and capabilities.
              </p>
            </div>

            <div className="mission-card">
              <span>03</span>

              <h3>Implement</h3>

              <p>
                Government evaluates solutions and connects approved ideas
                with suitable companies for implementation.
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="footer">

        <div className="footer-main">

          <div>
            <Link to="/" className="footer-brand">
              CIVIORA
            </Link>

            <p>
              Connecting civic problems with the people and organizations
              capable of solving them.
            </p>
          </div>

          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>

        </div>

        <div className="footer-bottom">
          <span>© 2026 Civiora</span>
          <span>AI-powered civic innovation platform</span>
        </div>

      </footer>

    </div>
  );
}

export default Home;
