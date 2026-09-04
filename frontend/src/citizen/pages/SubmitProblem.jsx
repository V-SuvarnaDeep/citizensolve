import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import "./SubmitProblem.css";

function SubmitProblem() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    impact: "",
    urgency: "",
    additionalInfo: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Problem submitted:", formData);
    alert("Problem submitted successfully!");
  };

  return (
    <div className="submit-problem-page">

      {/* Navbar */}
      <nav className="submit-navbar">
        <Link to="/citizen" className="submit-brand">
          CIVIORA
        </Link>

        <div className="submit-nav-links">
          <Link to="/citizen">Home</Link>
          <Link to="/citizen/submit" className="active">
            Submit Problem
          </Link>
          <Link to="/citizen/problems">My Problems</Link>
          <Link to="/citizen/notifications">Notifications</Link>
          <Link to="/citizen/settings">Settings</Link>
        </div>

        <Link to="/login" className="submit-logout">
          Logout
        </Link>
      </nav>

      <main className="submit-main">

        {/* Page Header */}
        <div className="submit-header">

          <Link to="/citizen" className="back-link">
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <span className="submit-label">
            CIVIC PROBLEM SUBMISSION
          </span>

          <h1>Tell us about the problem.</h1>

          <p>
            Describe a real-world societal problem and provide enough
            information for Civiora AI to understand and analyze it.
          </p>

        </div>

        {/* Form */}
        <form className="problem-form" onSubmit={handleSubmit}>

          {/* Basic Information */}
          <section className="form-section">

            <div className="form-section-header">
              <span>01</span>

              <div>
                <h2>Problem Information</h2>
                <p>
                  Give your problem a clear title and explain what is
                  happening.
                </p>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="title">
                Problem Title
              </label>

              <input
                id="title"
                type="text"
                name="title"
                placeholder="Example: Lack of waste collection in residential areas"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">
                Problem Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="6"
                placeholder="Explain the problem, who is affected, what causes it and what difficulties it creates..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

          </section>

          {/* Classification */}
          <section className="form-section">

            <div className="form-section-header">
              <span>02</span>

              <div>
                <h2>Problem Classification</h2>
                <p>
                  Help Civiora understand the nature and importance of the
                  problem.
                </p>
              </div>
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label htmlFor="category">
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="waste-management">
                    Waste Management
                  </option>
                  <option value="water">
                    Water
                  </option>
                  <option value="transportation">
                    Transportation
                  </option>
                  <option value="healthcare">
                    Healthcare
                  </option>
                  <option value="education">
                    Education
                  </option>
                  <option value="environment">
                    Environment
                  </option>
                  <option value="agriculture">
                    Agriculture
                  </option>
                  <option value="public-safety">
                    Public Safety
                  </option>
                  <option value="infrastructure">
                    Infrastructure
                  </option>
                  <option value="other">
                    Other
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="location">
                  Location
                </label>

                <input
                  id="location"
                  type="text"
                  name="location"
                  placeholder="City, district or area"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

          </section>

          {/* Impact */}
          <section className="form-section">

            <div className="form-section-header">
              <span>03</span>

              <div>
                <h2>Impact and Urgency</h2>
                <p>
                  Tell us how serious the problem is and how many people may
                  be affected.
                </p>
              </div>
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label htmlFor="impact">
                  Expected Impact
                </label>

                <select
                  id="impact"
                  name="impact"
                  value={formData.impact}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select impact level</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="urgency">
                  Urgency
                </label>

                <select
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select urgency</option>
                  <option value="low">Can wait</option>
                  <option value="medium">Needs attention</option>
                  <option value="high">Urgent</option>
                  <option value="critical">Immediate attention</option>
                </select>
              </div>

            </div>

          </section>

          {/* Additional Information */}
          <section className="form-section">

            <div className="form-section-header">
              <span>04</span>

              <div>
                <h2>Additional Information</h2>
                <p>
                  Add any other information that could help understand the
                  problem.
                </p>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="additionalInfo">
                Additional Details
                <span className="optional">Optional</span>
              </label>

              <textarea
                id="additionalInfo"
                name="additionalInfo"
                rows="5"
                placeholder="Add statistics, previous attempts, observations or any other useful information..."
                value={formData.additionalInfo}
                onChange={handleChange}
              />
            </div>

          </section>

          {/* Submit */}
          <div className="submit-actions">

            <Link to="/citizen" className="cancel-button">
              Cancel
            </Link>

            <button type="submit" className="submit-button">
              <Send size={18} />
              Submit Problem
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default SubmitProblem;