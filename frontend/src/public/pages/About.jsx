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
import "./About.css";

function About() {
  return (
    <div className="about-page">

      {/* Navbar */}
      <nav className="about-navbar">
        <Link to="/" className="about-brand">
          CIVIORA
        </Link>

        <div className="about-nav-links">
          <Link to="/">Home</Link>
          <Link to="/about" className="active">
            About
          </Link>
          <Link to="/how-it-works">How It Works</Link>
        </div>

        <div className="about-nav-actions">
          <Link to="/login" className="about-login">
            Login
          </Link>

          <Link to="/register" className="about-register">
            Get Started
            <ArrowRight size={17} />
          </Link>
        </div>
      </nav>

      <main>

        {/* Hero */}
        <section className="about-hero">
          <span className="about-label">ABOUT CIVIORA</span>

          <h1>
            Building a bridge between
            <span> problems and possibilities.</span>
          </h1>

          <p>
            Civiora is an AI-powered civic innovation platform designed to
            connect societal problems with the universities, government
            institutions and companies capable of turning them into
            real-world solutions.
          </p>
        </section>

        {/* What is Civiora */}
        <section className="about-introduction">

          <div className="about-intro-title">
            <span className="about-label">WHAT IS CIVIORA?</span>

            <h2>
              A structured ecosystem for
              <br />
              solving real problems.
            </h2>
          </div>

          <div className="about-intro-text">
            <p>
              Many societal problems are identified every day, but they often
              remain disconnected from the people and institutions that have
              the knowledge, technology and resources to solve them.
            </p>

            <p>
              Civiora creates a structured pathway from problem identification
              to implementation. Citizens can raise problems, AI can analyze
              and prioritize them, universities can develop solutions,
              government can evaluate them, and suitable companies can help
              bring approved solutions into the real world.
            </p>
          </div>

        </section>

        {/* Ecosystem */}
        <section className="ecosystem-section">

          <div className="section-heading">
            <span className="about-label">THE CIVIORA ECOSYSTEM</span>

            <h2>
              Every stakeholder has
              <br />
              a role to play.
            </h2>

            <p>
              Civiora brings different capabilities together through one
              coordinated platform.
            </p>
          </div>

          <div className="ecosystem-cards">

            <div className="ecosystem-card">
              <div className="ecosystem-icon">
                <Users size={25} />
              </div>

              <span>01</span>

              <h3>Citizens</h3>

              <p>
                Identify and submit real-world societal problems that need
                meaningful solutions.
              </p>
            </div>

            <div className="ecosystem-card">
              <div className="ecosystem-icon">
                <Brain size={25} />
              </div>

              <span>02</span>

              <h3>Artificial Intelligence</h3>

              <p>
                Analyze problems, detect similarities, prioritize challenges
                and identify suitable capabilities.
              </p>
            </div>

            <div className="ecosystem-card">
              <div className="ecosystem-icon">
                <GraduationCap size={25} />
              </div>

              <span>03</span>

              <h3>Universities</h3>

              <p>
                Use research, faculty expertise, laboratories and student
                capabilities to develop practical solutions.
              </p>
            </div>

            <div className="ecosystem-card">
              <div className="ecosystem-icon">
                <Landmark size={25} />
              </div>

              <span>04</span>

              <h3>Government</h3>

              <p>
                Review proposed solutions and help identify opportunities for
                real-world implementation.
              </p>
            </div>

            <div className="ecosystem-card">
              <div className="ecosystem-icon">
                <Building2 size={25} />
              </div>

              <span>05</span>

              <h3>Companies</h3>

              <p>
                Take approved solutions forward through implementation,
                collaboration and deployment.
              </p>
            </div>

          </div>
        </section>

        {/* Vision */}
        <section className="vision-section">

          <div>
            <span className="about-label">OUR VISION</span>

            <h2>
              Make solving societal problems
              <span> more connected, intelligent and actionable.</span>
            </h2>
          </div>

          <p>
            Civiora aims to create a future where a problem identified by a
            citizen does not stop at being a complaint. Instead, it becomes
            structured information that can reach the right expertise,
            resources and organizations needed to create measurable impact.
          </p>

        </section>

        {/* CTA */}
        <section className="about-cta">

          <div>
            <span className="about-label">
              BE PART OF THE NETWORK
            </span>

            <h2>
              Have a problem worth solving?
            </h2>

            <p>
              Start the journey with Civiora and help turn civic challenges
              into possibilities.
            </p>
          </div>

          <Link to="/register" className="about-cta-button">
            Get Started
            <ArrowRight size={18} />
          </Link>

        </section>

      </main>

      {/* Footer */}
      <footer className="about-footer">

        <div className="about-footer-main">

          <div>
            <Link to="/" className="about-footer-brand">
              CIVIORA
            </Link>

            <p>
              Connecting civic problems with the people and organizations
              capable of solving them.
            </p>
          </div>

          <div className="about-footer-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>

        </div>

        <div className="about-footer-bottom">
          <span>© 2026 Civiora</span>
          <span>AI-powered civic innovation platform</span>
        </div>

      </footer>

    </div>
  );
}

export default About;
