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
          <Link to="/" className="active">
            Home
          </Link>

          <Link to="/about">
            About
          </Link>

          <Link to="/how-it-works">
            How It Works
          </Link>
        </div>

        <div className="navbar-actions">
          <Link to="/login" className="login-link">
            Login
          </Link>

          <Link to="/register" className="register-button">
            Get Started
            <ArrowRight size={16} />
          </Link>
        </div>

      </nav>


      <main>

        {/* Hero */}
        <section className="hero-section">

          <div className="hero-container">

            <div className="hero-copy">

              <div className="hero-badge">
                <Brain size={16} />
                AI-POWERED CIVIC INNOVATION
              </div>

              <h1>
                Turning civic
                <span> problems </span>
                into
                <span> real solutions.</span>
              </h1>

              <p className="hero-description">
                Civiora creates a structured bridge between citizens,
                artificial intelligence, government, universities and
                companies to turn real-world civic problems into
                practical solutions that can actually be implemented.
              </p>

              <div className="hero-actions">

                <Link to="/register" className="primary-button">
                  Submit a Problem
                  <ArrowRight size={18} />
                </Link>

                <Link to="/how-it-works" className="secondary-button">
                  Explore How It Works
                </Link>

              </div>

            </div>


            {/* Civiora ecosystem */}
            <div className="hero-visual">

              <div className="visual-label">
                CIVIORA ECOSYSTEM
              </div>

              <div className="ecosystem-flow">

                <div className="ecosystem-node">
                  <div className="node-icon">
                    <Users size={21} />
                  </div>

                  <div>
                    <strong>Citizen</strong>
                    <span>Identifies a problem</span>
                  </div>
                </div>

                <div className="flow-line"></div>

                <div className="ecosystem-node">
                  <div className="node-icon">
                    <Brain size={21} />
                  </div>

                  <div>
                    <strong>Civiora AI</strong>
                    <span>Analyzes & prioritizes</span>
                  </div>
                </div>

                <div className="flow-line"></div>

                <div className="ecosystem-node">
                  <div className="node-icon">
                    <Landmark size={21} />
                  </div>

                  <div>
                    <strong>Government</strong>
                    <span>Validates the problem</span>
                  </div>
                </div>

                <div className="flow-line"></div>

                <div className="ecosystem-node">
                  <div className="node-icon">
                    <GraduationCap size={21} />
                  </div>

                  <div>
                    <strong>University</strong>
                    <span>Develops the solution</span>
                  </div>
                </div>

                <div className="flow-line"></div>

                <div className="ecosystem-node">
                  <div className="node-icon">
                    <Building2 size={21} />
                  </div>

                  <div>
                    <strong>Company</strong>
                    <span>Supports implementation</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* Mission */}
        <section className="mission-section">

          <div className="content-width">

            <div className="mission-header">

              <div className="section-label">
                THE CIVIORA MISSION
              </div>

              <div className="mission-heading">

                <h2>
                  One problem.
                  <br />
                  Multiple possibilities.
                </h2>

                <p>
                  Civic problems often exist because the people who
                  experience them are disconnected from the institutions
                  that have the knowledge, authority and resources to
                  solve them. Civiora creates that connection.
                </p>

              </div>

            </div>


            <div className="mission-divider"></div>


            <div className="mission-points">

              <div className="mission-point">

                <span>01</span>

                <div>
                  <h3>Problems start with people</h3>

                  <p>
                    Citizens can bring real problems from their
                    communities into a structured system.
                  </p>
                </div>

              </div>


              <div className="mission-point">

                <span>02</span>

                <div>
                  <h3>AI creates structure</h3>

                  <p>
                    Civiora analyzes, categorizes and prioritizes
                    problems before they reach the next stage.
                  </p>
                </div>

              </div>


              <div className="mission-point">

                <span>03</span>

                <div>
                  <h3>Solutions reach implementation</h3>

                  <p>
                    Universities develop solutions while government
                    and companies help move approved ideas toward
                    implementation.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* Ecosystem */}
        <section className="ecosystem-section">

          <div className="content-width">

            <div className="section-top">

              <div>

                <span className="section-label">
                  ONE CONNECTED ECOSYSTEM
                </span>

                <h2>
                  Every role has a purpose.
                </h2>

              </div>

              <p>
                Civiora brings different participants into one
                structured workflow so that a problem can move from
                identification to implementation.
              </p>

            </div>


            <div className="role-grid">

              <div className="role-card">

                <div className="role-number">01</div>

                <div className="role-icon">
                  <Users size={22} />
                </div>

                <h3>Citizens</h3>

                <p>
                  Identify and submit problems from their communities.
                </p>

              </div>


              <div className="role-card">

                <div className="role-number">02</div>

                <div className="role-icon">
                  <Brain size={22} />
                </div>

                <h3>AI</h3>

                <p>
                  Understands problems, determines priority and helps
                  match them with suitable capabilities.
                </p>

              </div>


              <div className="role-card">

                <div className="role-number">03</div>

                <div className="role-icon">
                  <Landmark size={22} />
                </div>

                <h3>Government</h3>

                <p>
                  Reviews problems, validates solutions and provides
                  the final public-sector direction.
                </p>

              </div>


              <div className="role-card">

                <div className="role-number">04</div>

                <div className="role-icon">
                  <GraduationCap size={22} />
                </div>

                <h3>Universities</h3>

                <p>
                  Convert approved civic challenges into practical
                  technical and research solutions.
                </p>

              </div>


              <div className="role-card">

                <div className="role-number">05</div>

                <div className="role-icon">
                  <Building2 size={22} />
                </div>

                <h3>Companies</h3>

                <p>
                  Help take suitable solutions toward real-world
                  implementation.
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>


      {/* Footer */}
      <footer className="footer">

        <div className="footer-main">

          <div className="footer-brand-section">

            <Link to="/" className="footer-brand">
              CIVIORA
            </Link>

            <p>
              Connecting civic problems with the people and
              organizations capable of solving them.
            </p>

          </div>


          <div className="footer-column">

            <span>Platform</span>

            <Link to="/how-it-works">
              How It Works
            </Link>

            <Link to="/register">
              Get Started
            </Link>

          </div>


          <div className="footer-column">

            <span>Company</span>

            <Link to="/about">
              About
            </Link>

            <Link to="/login">
              Login
            </Link>

          </div>

        </div>


        <div className="footer-bottom">

          <span>
            © 2026 Civiora
          </span>

          <span>
            AI-powered civic innovation platform
          </span>

        </div>

      </footer>

    </div>
  );
}

export default Home;