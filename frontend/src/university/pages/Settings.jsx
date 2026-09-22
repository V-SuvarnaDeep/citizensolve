import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./Settings.css";

function Settings() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profileData, error: profileError } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

      if (profileError) {
        throw profileError;
      }

      setProfile(profileData);

      const { data: universityData, error: universityError } =
        await supabase
          .from("universities")
          .select("*")
          .eq("profile_id", user.id)
          .single();

      if (
        universityError &&
        universityError.code !== "PGRST116"
      ) {
        throw universityError;
      }

      setUniversity(universityData);

    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <div className="settings-spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="settings-page">

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

          <Link to="/university/meetings">
            Meetings
          </Link>

          <Link to="/university/notifications">
            Notifications
          </Link>

          <Link
            to="/university/settings"
            className="active"
          >
            Settings
          </Link>

        </div>

        <button
          onClick={handleLogout}
          className="university-logout"
        >
          Logout
        </button>

      </nav>

      {/* SETTINGS */}

      <main className="settings-content">

        <div className="settings-header">

          <p className="settings-label">
            UNIVERSITY ACCOUNT
          </p>

          <h1>
            University Settings
          </h1>

          <p className="settings-description">
            View your university profile and account information.
          </p>

        </div>

        {/* PROFILE */}

        <section className="settings-card">

          <div className="settings-card-header">

            <h2>
              University Profile
            </h2>

            <p>
              Information associated with your Civiora account.
            </p>

          </div>

          <div className="profile-layout">

            <div className="profile-avatar">

              {university?.university_name
                ? university.university_name
                    .substring(0, 2)
                    .toUpperCase()
                : "UN"}

            </div>

            <div className="profile-main">

              <h2>
                {university?.university_name ||
                  profile?.name ||
                  "University"}
              </h2>

              <span className="role-badge">
                University
              </span>

            </div>

          </div>

          <div className="settings-grid">

            <div className="settings-field">

              <label>
                University Name
              </label>

              <div className="field-value">
                {university?.university_name ||
                  "Not available"}
              </div>

            </div>

            <div className="settings-field">

              <label>
                Civiora ID
              </label>

              <div className="field-value">
                {profile?.civiora_id ||
                  "Not available"}
              </div>

            </div>

            <div className="settings-field">

              <label>
                Email
              </label>

              <div className="field-value">
                {profile?.email ||
                  "Not available"}
              </div>

            </div>

            <div className="settings-field">

              <label>
                Location
              </label>

              <div className="field-value">
                {university?.location ||
                  "Not available"}
              </div>

            </div>

          </div>

        </section>

        {/* ACADEMIC INFORMATION */}

        <section className="settings-card">

          <div className="settings-card-header">

            <h2>
              Academic & Technical Information
            </h2>

            <p>
              Capabilities registered for university matching.
            </p>

          </div>

          <div className="information-section">

            <div className="information-block">

              <h3>
                Departments
              </h3>

              <div className="tag-container">

                {university?.departments?.length > 0 ? (
                  university.departments.map(
                    (department, index) => (
                      <span
                        className="info-tag"
                        key={index}
                      >
                        {department}
                      </span>
                    )
                  )
                ) : (
                  <span className="no-information">
                    No departments available
                  </span>
                )}

              </div>

            </div>

            <div className="information-block">

              <h3>
                Expertise
              </h3>

              <div className="tag-container">

                {university?.expertise?.length > 0 ? (
                  university.expertise.map(
                    (item, index) => (
                      <span
                        className="info-tag"
                        key={index}
                      >
                        {item}
                      </span>
                    )
                  )
                ) : (
                  <span className="no-information">
                    No expertise information available
                  </span>
                )}

              </div>

            </div>

            <div className="information-block">

              <h3>
                Technologies
              </h3>

              <div className="tag-container">

                {university?.technologies?.length > 0 ? (
                  university.technologies.map(
                    (technology, index) => (
                      <span
                        className="info-tag"
                        key={index}
                      >
                        {technology}
                      </span>
                    )
                  )
                ) : (
                  <span className="no-information">
                    No technologies available
                  </span>
                )}

              </div>

            </div>

            <div className="information-block">

              <h3>
                Capabilities
              </h3>

              <div className="tag-container">

                {university?.capabilities?.length > 0 ? (
                  university.capabilities.map(
                    (capability, index) => (
                      <span
                        className="info-tag"
                        key={index}
                      >
                        {capability}
                      </span>
                    )
                  )
                ) : (
                  <span className="no-information">
                    No capabilities available
                  </span>
                )}

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Settings;