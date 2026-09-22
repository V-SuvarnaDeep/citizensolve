import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./Profile.css";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    company_name: "",
    location: "",
    industries: "",
    expertise: "",
    technologies: "",
    capabilities: "",
    description: ""
  });

  useEffect(() => {
    loadCompanyProfile();
  }, []);

  const loadCompanyProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("profile_id", user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setFormData({
          company_name: data.company_name || "",
          location: data.location || "",
          industries: Array.isArray(data.industries)
            ? data.industries.join(", ")
            : "",
          expertise: Array.isArray(data.expertise)
            ? data.expertise.join(", ")
            : "",
          technologies: Array.isArray(data.technologies)
            ? data.technologies.join(", ")
            : "",
          capabilities: Array.isArray(data.capabilities)
            ? data.capabilities.join(", ")
            : "",
          description: data.description || ""
        });
      }
    } catch (error) {
      console.error("Error loading company profile:", error);
      setError("Unable to load company profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const convertToArray = (value) => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!formData.company_name.trim()) {
      setError("Please enter the company name.");
      return;
    }

    try {
      setSaving(true);

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You are not logged in.");
        setSaving(false);
        return;
      }

      const companyData = {
        profile_id: user.id,
        company_name: formData.company_name.trim(),
        location: formData.location.trim(),
        industries: convertToArray(formData.industries),
        expertise: convertToArray(formData.expertise),
        technologies: convertToArray(formData.technologies),
        capabilities: convertToArray(formData.capabilities),
        description: formData.description.trim()
      };

      const { error } = await supabase
        .from("companies")
        .upsert(companyData, {
          onConflict: "profile_id"
        });

      if (error) {
        throw error;
      }

      setMessage("Company profile saved successfully.");

      await loadCompanyProfile();
    } catch (error) {
      console.error("Error saving company profile:", error);
      setError("Unable to save company profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="company-profile-loading">
        Loading company profile...
      </div>
    );
  }

  return (
    <div className="company-profile-page">

      <nav className="company-navbar">
        <Link to="/company" className="company-logo">
          CIVIORA
        </Link>

        <div className="company-nav-links">
          <Link to="/company">
            Dashboard
          </Link>

          <Link to="/company/opportunities">
            Opportunities
          </Link>

          <Link to="/company/solutions">
            Solutions
          </Link>

          <Link to="/company/meetings">
            Meetings
          </Link>

          <Link to="/company/notifications">
            Notifications
          </Link>

          <Link to="/company/settings">
            Settings
          </Link>
        </div>

        <Link to="/login" className="company-logout">
          Logout
        </Link>
      </nav>

      <main className="company-profile-container">

        <div className="company-profile-heading">
          <div>
            <p className="company-profile-label">
              COMPANY PROFILE
            </p>

            <h1>Company Information</h1>

            <p>
              Tell Civiora about your company so AI can identify
              relevant civic solutions and implementation opportunities.
            </p>
          </div>
        </div>

        {message && (
          <div className="company-profile-success">
            {message}
          </div>
        )}

        {error && (
          <div className="company-profile-error">
            {error}
          </div>
        )}

        <form
          className="company-profile-form"
          onSubmit={handleSubmit}
        >

          <section className="company-form-section">

            <div className="company-form-section-title">
              <h2>Basic Information</h2>
              <p>
                Basic details about your company.
              </p>
            </div>

            <div className="company-form-grid">

              <div className="company-form-group">
                <label>
                  Company Name
                </label>

                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  required
                />
              </div>

              <div className="company-form-group">
                <label>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State"
                />
              </div>

            </div>

            <div className="company-form-group">
              <label>
                Company Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly describe your company and what it does..."
                rows="5"
              />
            </div>

          </section>

          <section className="company-form-section">

            <div className="company-form-section-title">
              <h2>Industry & Expertise</h2>
              <p>
                These details will help Civiora match your company
                with relevant opportunities.
              </p>
            </div>

            <div className="company-form-group">
              <label>
                Industries
              </label>

              <input
                type="text"
                name="industries"
                value={formData.industries}
                onChange={handleChange}
                placeholder="Software, Healthcare, Infrastructure"
              />

              <small>
                Separate multiple industries with commas.
              </small>
            </div>

            <div className="company-form-group">
              <label>
                Expertise
              </label>

              <input
                type="text"
                name="expertise"
                value={formData.expertise}
                onChange={handleChange}
                placeholder="Artificial Intelligence, IoT, Cybersecurity"
              />

              <small>
                Separate multiple areas with commas.
              </small>
            </div>

          </section>

          <section className="company-form-section">

            <div className="company-form-section-title">
              <h2>Technology & Capabilities</h2>
              <p>
                Tell us what technologies and solutions your company
                can work with.
              </p>
            </div>

            <div className="company-form-group">
              <label>
                Technologies
              </label>

              <input
                type="text"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                placeholder="Python, React, IoT, Cloud Computing"
              />

              <small>
                Separate technologies with commas.
              </small>
            </div>

            <div className="company-form-group">
              <label>
                Capabilities
              </label>

              <input
                type="text"
                name="capabilities"
                value={formData.capabilities}
                onChange={handleChange}
                placeholder="AI Solutions, Web Development, Data Analysis"
              />

              <small>
                Separate capabilities with commas.
              </small>
            </div>

          </section>

          <div className="company-form-actions">

            <Link
              to="/company"
              className="company-cancel-button"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="company-save-button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Company Profile"}
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default Profile;