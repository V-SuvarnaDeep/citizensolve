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

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError("Please upload an image of the problem.");
      return;
    }

    setLoading(true);
    setError("");
    setAiResult(null);

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("location", formData.location);
      data.append("impact", formData.impact);
      data.append("urgency", formData.urgency);
      data.append("additionalInfo", formData.additionalInfo);
      data.append("image", image);

      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error("AI service failed to analyze the problem.");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error("Problem analysis was unsuccessful.");
      }

      console.log("Civiora AI Analysis:", result.analysis);

      setAiResult(result.analysis);

    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err.message ||
          "Something went wrong while connecting to Civiora AI."
      );
    } finally {
      setLoading(false);
    }
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

            {/* Image Upload */}
            <div className="form-group">
              <label htmlFor="image">
                Problem Image
              </label>

              <input
                id="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                required
              />

              <small>
                Upload a clear image showing the civic problem.
              </small>
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

          {/* Error */}
          {error && (
            <div
              style={{
                padding: "14px",
                marginBottom: "20px",
                borderRadius: "8px",
                background: "#ffe5e5",
                color: "#b00020",
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="submit-actions">

            <Link to="/citizen" className="cancel-button">
              Cancel
            </Link>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              <Send size={18} />

              {loading
                ? "Analyzing Problem..."
                : "Submit Problem"}
            </button>

          </div>

        </form>

        {/* AI Result */}
        {aiResult && (
          <section
            style={{
              marginTop: "40px",
              padding: "30px",
              borderRadius: "12px",
              background: "#f5f7fa",
              border: "1px solid #e1e5ea",
            }}
          >
            <span className="submit-label">
              CIVIORA AI ANALYSIS
            </span>

            <h2 style={{ marginTop: "10px" }}>
              AI Analysis Complete
            </h2>

            <p>
              <strong>Category:</strong>{" "}
              {aiResult.category}
            </p>

            <p>
              <strong>Problem Type:</strong>{" "}
              {aiResult.problemType}
            </p>

            <p>
              <strong>Severity:</strong>{" "}
              {aiResult.severity}
            </p>

            <p>
              <strong>Urgency:</strong>{" "}
              {aiResult.urgency}
            </p>

            <p>
              <strong>Visual Severity:</strong>{" "}
              {aiResult.visualSeverity}
            </p>

            <p>
              <strong>Affected Population:</strong>{" "}
              {aiResult.affectedPopulation}
            </p>

            <p>
              <strong>Safety Risk:</strong>{" "}
              {aiResult.safetyRisk}
            </p>

            <p>
              <strong>Geographic Impact:</strong>{" "}
              {aiResult.geographicImpact}
            </p>

            <p>
              <strong>Time Sensitivity:</strong>{" "}
              {aiResult.timeSensitivity}
            </p>

            <p>
              <strong>AI Summary:</strong>{" "}
              {aiResult.summary}
            </p>

            <p>
              <strong>Required Skills:</strong>{" "}
              {Array.isArray(aiResult.requiredSkills)
                ? aiResult.requiredSkills.join(", ")
                : aiResult.requiredSkills}
            </p>

            <p>
              <strong>Keywords:</strong>{" "}
              {Array.isArray(aiResult.keywords)
                ? aiResult.keywords.join(", ")
                : aiResult.keywords}
            </p>
          </section>
        )}

      </main>

    </div>
  );
}

export default SubmitProblem;