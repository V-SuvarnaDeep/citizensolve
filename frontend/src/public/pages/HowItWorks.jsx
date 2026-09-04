import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  Brain,
  Building2,
  CheckCircle,
  GraduationCap,
  Landmark,
  MapPin,
  Users,
} from "lucide-react";
import "./HowItWorks.css";

function HowItWorks() {
  return (
    <div className="how-page">

      {/* Navbar */}
      <nav className="how-navbar">
        <Link to="/" className="how-brand">
          CIVIORA
        </Link>

        <div className="how-nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/how-it-works" className="active">
            How It Works
          </Link>
        </div>

        <div className="how-nav-actions">
          <Link to="/login" className="how-login">
            Login
          </Link>

          <Link to="/register" className="how-register">
            Get Started
            <ArrowRight size={17} />
          </Link>
        </div>
      </nav>

      <main>

        {/* Hero */}
        <section className="how-hero">
          <span className="how-label">HOW CIVIORA WORKS</span>

          <h1>
            From a civic problem
            <span> to real-world impact.</span>
          </h1>

          <p>
            Civiora creates a structured journey that moves a problem from
            citizen identification through AI analysis, university innovation,
            government review and company implementation.
          </p>
        </section>

        {/* Workflow */}
        <section className="workflow-section">

          <div className="workflow-heading">
            <span className="how-label">THE CIVIORA WORKFLOW</span>

            <h2>
              One connected journey.
            </h2>

            <p>
              Every stakeholder contributes at the stage where their
              capabilities can create the greatest impact.
            </p>
          </div>

          {/* Step 1 */}
          <div className="workflow-step">

            <div className="step-number">01</div>

            <div className="step-icon">
              <Users size={28} />
            </div>

            <div className="step-content">
              <span>CITIZEN</span>

              <h3>Submit a Problem</h3>

              <p>
                A citizen submits a real-world societal problem through
                Civiora. The problem is captured with relevant details,
                location and category information.
              </p>
            </div>

          </div>

          <div className="workflow-arrow">
            <ArrowDown size={24} />
          </div>

          {/* Step 2 */}
          <div className="workflow-step">

            <div className="step-number">02</div>

            <div className="step-icon ai-step">
              <Brain size={28} />
            </div>

            <div className="step-content">
              <span>ARTIFICIAL INTELLIGENCE</span>

              <h3>Analyze and Prioritize</h3>

              <p>
                Civiora AI analyzes the problem, identifies its category and
                priority, detects similar problems and determines the
                capabilities required to address it.
              </p>
            </div>

          </div>

          <div className="workflow-arrow">
            <ArrowDown size={24} />
          </div>

          {/* Step 3 */}
          <div className="workflow-step">

            <div className="step-number">03</div>

            <div className="step-icon">
              <GraduationCap size={28} />
            </div>

            <div className="step-content">
              <span>UNIVERSITY</span>

              <h3>Match the Right Expertise</h3>

              <p>
                AI evaluates university capabilities such as departments,
                faculty expertise, laboratories, technologies, previous
                projects and research strengths to identify the best-fit
                universities.
              </p>
            </div>

          </div>

          <div className="workflow-arrow">
            <ArrowDown size={24} />
          </div>

          {/* Step 4 */}
          <div className="workflow-step">

            <div className="step-number">04</div>

            <div className="step-icon">
              <GraduationCap size={28} />
            </div>

            <div className="step-content">
              <span>UNIVERSITY</span>

              <h3>Accept and Develop</h3>

              <p>
                Assigned universities review the problem and can accept it.
                Accepted universities work on the challenge and develop a
                practical solution or prototype.
              </p>
            </div>

          </div>

          <div className="workflow-arrow">
            <ArrowDown size={24} />
          </div>

          {/* Step 5 */}
          <div className="workflow-step">

            <div className="step-number">05</div>

            <div className="step-icon">
              <Landmark size={28} />
            </div>

            <div className="step-content">
              <span>GOVERNMENT</span>

              <h3>Review the Solution</h3>

              <p>
                The completed solution is submitted to the government
                workspace. Government officials review the technical proposal
                and prototype for suitability and potential implementation.
              </p>
            </div>

          </div>

          <div className="workflow-arrow">
            <ArrowDown size={24} />
          </div>

          {/* Step 6 */}
          <div className="workflow-step">

            <div className="step-number">06</div>

            <div className="step-icon">
              <Building2 size={28} />
            </div>

            <div className="step-content">
              <span>COMPANY</span>

              <h3>Find the Right Implementation Partner</h3>

              <p>
                Once a solution is approved, Civiora AI identifies a suitable
                company based on capabilities, technology requirements,
                implementation capacity and relevant location factors.
              </p>
            </div>

          </div>

          <div className="workflow-arrow">
            <ArrowDown size={24} />
          </div>

          {/* Step 7 */}
          <div className="workflow-step">

            <div className="step-number">07</div>

            <div className="step-icon">
              <CheckCircle size={28} />
            </div>

            <div className="step-content">
              <span>COMPANY</span>

              <h3>Accept the Opportunity</h3>

              <p>
                The selected company receives the approved solution and can
                accept the opportunity to participate in its implementation.
              </p>
            </div>

          </div>

          <div className="workflow-arrow">
            <ArrowDown size={24} />
          </div>

          {/* Step 8 */}
          <div className="workflow-step">

            <div className="step-number">08</div>

            <div className="step-icon">
              <MapPin size={28} />
            </div>

            <div className="step-content">
              <span>MEETING</span>

              <h3>Connect and Plan Implementation</h3>

              <p>
                After company acceptance, Civiora identifies suitable nearby
                meeting opportunities and coordinates the meeting between the
                government and company for implementation planning.
              </p>
            </div>

          </div>

        </section>

        {/* Final Impact */}
        <section className="impact-section">

          <div className="impact-content">

            <span className="how-label">THE END GOAL</span>

            <h2>
              From problem
              <span> to measurable impact.</span>
            </h2>

            <p>
              Civiora does not stop when a solution is proposed. The platform
              is designed to create a continuous path from identifying a
              problem to developing, approving and implementing a solution.
            </p>

          </div>

          <div className="impact-flow">

            <div className="impact-item">
              <Users size={22} />
              <span>Problem</span>
            </div>

            <ArrowRight size={20} />

            <div className="impact-item">
              <Brain size={22} />
              <span>AI</span>
            </div>

            <ArrowRight size={20} />

            <div className="impact-item">
              <GraduationCap size={22} />
              <span>Solution</span>
            </div>

            <ArrowRight size={20} />

            <div className="impact-item">
              <Landmark size={22} />
              <span>Approval</span>
            </div>

            <ArrowRight size={20} />

            <div className="impact-item">
              <Building2 size={22} />
              <span>Implementation</span>
            </div>

          </div>

        </section>

        {/* CTA */}
        <section className="how-cta">

          <div>
            <span className="how-label">READY TO CONTRIBUTE?</span>

            <h2>
              Start with a problem.
            </h2>

            <p>
              Your idea could become the starting point for a real solution.
            </p>
          </div>

          <Link to="/register" className="how-cta-button">
            Get Started
            <ArrowRight size={18} />
          </Link>

        </section>

      </main>

      {/* Footer */}
      <footer className="how-footer">

        <div className="how-footer-main">

          <div>
            <Link to="/" className="how-footer-brand">
              CIVIORA
            </Link>

            <p>
              Connecting civic problems with the people and organizations
              capable of solving them.
            </p>
          </div>

          <div className="how-footer-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>

        </div>

        <div className="how-footer-bottom">
          <span>© 2026 Civiora</span>
          <span>AI-powered civic innovation platform</span>
        </div>

      </footer>

    </div>
  );
}

export default HowItWorks;
