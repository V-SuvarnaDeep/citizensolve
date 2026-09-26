import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./Settings.css";
import "./GovernmentNavbar.css";

function Settings() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Government user session not found.");
        return;
      }

      setUserEmail(user.email || "");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load government profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="government-settings-page">

        <nav className="government-navbar">

          <Link
            to="/government"
            className="government-logo"
          >
            CIVIORA
          </Link>

          <div className="government-nav-links">

            <Link to="/government">
              Home
            </Link>

            <Link to="/government/problems">
              Problems
            </Link>

            <Link to="/government/solutions">
              Solutions
            </Link>

            <Link to="/government/meetings">
              Meetings
            </Link>

            <Link to="/government/notifications">
              Notifications
            </Link>

            <Link
              to="/government/settings"
              className="active"
            >
              Settings
            </Link>

          </div>

          <Link
            to="/login"
            className="government-logout"
          >
            Logout
          </Link>

        </nav>

        <main className="government-settings-content">

          <div className="settings-message">
            Loading government settings...
          </div>

        </main>

      </div>
    );
  }

  if (error) {
    return (
      <div className="government-settings-page">

        <nav className="government-navbar">

          <Link
            to="/government"
            className="government-logo"
          >
            CIVIORA
          </Link>

          <div className="government-nav-links">

            <Link to="/government">
              Home
            </Link>

            <Link to="/government/problems">
              Problems
            </Link>

            <Link to="/government/solutions">
              Solutions
            </Link>

            <Link to="/government/meetings">
              Meetings
            </Link>

            <Link to="/government/notifications">
              Notifications
            </Link>

            <Link
              to="/government/settings"
              className="active"
            >
              Settings
            </Link>

          </div>

          <Link
            to="/login"
            className="government-logout"
          >
            Logout
          </Link>

        </nav>

        <main className="government-settings-content">

          <div className="settings-error">
            {error}
          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="government-settings-page">

      {/* NAVBAR */}

      <nav className="government-navbar">

        <Link
          to="/government"
          className="government-logo"
        >
          CIVIORA
        </Link>

        <div className="government-nav-links">

          <Link to="/government">
            Home
          </Link>

          <Link to="/government/problems">
            Problems
          </Link>

          <Link to="/government/solutions">
            Solutions
          </Link>

          <Link to="/government/meetings">
            Meetings
          </Link>

          <Link to="/government/notifications">
            Notifications
          </Link>

          <Link
            to="/government/settings"
            className="active"
          >
            Settings
          </Link>

        </div>

        <button
          className="government-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </nav>


      {/* CONTENT */}

      <main className="government-settings-content">

        <div className="settings-header">

          <p className="settings-label">
            GOVERNMENT WORKSPACE
          </p>

          <h1 className="settings-title">
            Settings
          </h1>

          <p className="settings-subtitle">
            Manage your government account and access information.
          </p>

        </div>


        {/* PROFILE */}

        <section className="settings-section">

          <div className="settings-section-heading">

            <div>

              <h2>
                Government Profile
              </h2>

              <p>
                Account information associated with this government account.
              </p>

            </div>

          </div>


          <div className="profile-card">

            <div className="profile-avatar">
              {(profile?.name ||
                profile?.full_name ||
                "G"
              )
                .charAt(0)
                .toUpperCase()}
            </div>


            <div className="profile-main">

              <h3>
                {profile?.name ||
                  profile?.full_name ||
                  "Government Authority"}
              </h3>

              <p>
                {userEmail}
              </p>

            </div>

            <span className="profile-role">
              Government
            </span>

          </div>


          <div className="settings-details">

            <div className="settings-detail">

              <span>
                FULL NAME
              </span>

              <strong>
                {profile?.name ||
                  profile?.full_name ||
                  "Not available"}
              </strong>

            </div>


            <div className="settings-detail">

              <span>
                EMAIL
              </span>

              <strong>
                {userEmail || "Not available"}
              </strong>

            </div>


            <div className="settings-detail">

              <span>
                ROLE
              </span>

              <strong>
                {profile?.role || "government"}
              </strong>

            </div>


            <div className="settings-detail">

              <span>
                ACCOUNT STATUS
              </span>

              <strong className="status-active">
                Active
              </strong>

            </div>

          </div>

        </section>


        {/* PLATFORM ACCESS */}

        <section className="settings-section">

          <div className="settings-section-heading">

            <div>

              <h2>
                Platform Access
              </h2>

              <p>
                Your current responsibilities within the Civiora workflow.
              </p>

            </div>

          </div>


          <div className="access-list">

            <div className="access-item">

              <div className="access-icon">
                ✓
              </div>

              <div>

                <h3>
                  Problem Validation
                </h3>

                <p>
                  Review and approve civic problems submitted by citizens.
                </p>

              </div>

            </div>


            <div className="access-item">

              <div className="access-icon">
                ✓
              </div>

              <div>

                <h3>
                  Solution Review
                </h3>

                <p>
                  Review solutions developed by matched universities.
                </p>

              </div>

            </div>


            <div className="access-item">

              <div className="access-icon">
                ✓
              </div>

              <div>

                <h3>
                  Implementation Coordination
                </h3>

                <p>
                  Coordinate approved solutions with implementation companies.
                </p>

              </div>

            </div>


            <div className="access-item">

              <div className="access-icon">
                ✓
              </div>

              <div>

                <h3>
                  Meeting Management
                </h3>

                <p>
                  View and manage meetings created through the Civiora workflow.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* SECURITY */}

        <section className="settings-section">

          <div className="settings-section-heading">

            <div>

              <h2>
                Account Security
              </h2>

              <p>
                Basic security information for your Civiora account.
              </p>

            </div>

          </div>


          <div className="security-card">

            <div>

              <span className="security-label">
                AUTHENTICATION
              </span>

              <h3>
                Secure account session
              </h3>

              <p>
                Your account is authenticated through the Civiora
                authentication system.
              </p>

            </div>

            <span className="security-status">
              Protected
            </span>

          </div>

        </section>


        {/* DANGER ZONE */}

        <section className="settings-section danger-section">

          <div className="settings-section-heading">

            <div>

              <h2>
                Account Actions
              </h2>

              <p>
                Sign out from the current government account.
              </p>

            </div>

          </div>


          <div className="danger-card">

            <div>

              <h3>
                Sign out
              </h3>

              <p>
                You will be returned to the Civiora login page.
              </p>

            </div>

            <button
              className="settings-logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Settings;