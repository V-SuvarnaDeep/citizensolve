import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./Settings.css";

function Settings() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  loadProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data: {
          user,
        },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load government profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();

      navigate("/login");
    } catch (error) {
      console.error(error);
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
              Dashboard
            </Link>

            <Link to="/government">
              Problems
            </Link>

            <Link to="/government/solutions">
              Solutions
            </Link>

            <Link to="/government/companies">
              Companies
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

  if (error || !profile) {
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
              Dashboard
            </Link>

            <Link to="/government">
              Problems
            </Link>

            <Link to="/government/solutions">
              Solutions
            </Link>

            <Link to="/government/companies">
              Companies
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
            {error || "Government profile not found."}
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
            Dashboard
          </Link>

          <Link to="/government">
            Problems
          </Link>

          <Link to="/government/solutions">
            Solutions
          </Link>

          <Link to="/government/companies">
            Companies
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

      {/* SETTINGS CONTENT */}

      <main className="government-settings-content">

        <div className="settings-page-header">

          <div>

            <p className="settings-label">
              GOVERNMENT WORKSPACE
            </p>

            <h1>
              Settings
            </h1>

            <p>
              Manage your Civiora government account and
              workspace information.
            </p>

          </div>

        </div>

        <div className="settings-layout">

          {/* SETTINGS SIDEBAR */}

          <aside className="settings-sidebar">

            <div className="settings-sidebar-item active">

              <span className="settings-sidebar-icon">
                ◉
              </span>

              <div>
                <strong>
                  Profile
                </strong>

                <small>
                  Account information
                </small>
              </div>

            </div>

            <div className="settings-sidebar-item">

              <span className="settings-sidebar-icon">
                ◇
              </span>

              <div>
                <strong>
                  Security
                </strong>

                <small>
                  Account protection
                </small>
              </div>

            </div>

            <div className="settings-sidebar-item">

              <span className="settings-sidebar-icon">
                ✓
              </span>

              <div>
                <strong>
                  Notifications
                </strong>

                <small>
                  Platform updates
                </small>
              </div>

            </div>

          </aside>

          {/* SETTINGS MAIN */}

          <section className="settings-main">

            <div className="settings-card">

              <div className="settings-card-header">

                <div>

                  <p className="card-label">
                    ACCOUNT
                  </p>

                  <h2>
                    Government Profile
                  </h2>

                  <p>
                    Information associated with your Civiora
                    government account.
                  </p>

                </div>

                <div className="profile-avatar">
                  {profile.name
                    ? profile.name.charAt(0).toUpperCase()
                    : "G"}
                </div>

              </div>

              <div className="profile-details">

                <div className="profile-detail">

                  <span>
                    Full Name
                  </span>

                  <strong>
                    {profile.name || "Not available"}
                  </strong>

                </div>

                <div className="profile-detail">

                  <span>
                    Email Address
                  </span>

                  <strong>
                    {profile.email || "Not available"}
                  </strong>

                </div>

                <div className="profile-detail">

                  <span>
                    Civiora ID
                  </span>

                  <strong className="civiora-id">
                    {profile.civiora_id || "Not available"}
                  </strong>

                </div>

                <div className="profile-detail">

                  <span>
                    Account Role
                  </span>

                  <strong className="role-value">
                    Government
                  </strong>

                </div>

              </div>

            </div>

            <div className="settings-card">

              <div className="settings-card-header">

                <div>

                  <p className="card-label">
                    PLATFORM ACCESS
                  </p>

                  <h2>
                    Government Workspace
                  </h2>

                  <p>
                    Your account is connected to the
                    government workflow of Civiora.
                  </p>

                </div>

                <span className="access-status">
                  Active
                </span>

              </div>

              <div className="access-list">

                <div className="access-item">

                  <div className="access-icon">
                    AI
                  </div>

                  <div>

                    <strong>
                      AI Priority Review
                    </strong>

                    <p>
                      Review AI-ranked civic problems
                      before government validation.
                    </p>

                  </div>

                  <span className="enabled">
                    Enabled
                  </span>

                </div>

                <div className="access-item">

                  <div className="access-icon">
                    ✓
                  </div>

                  <div>

                    <strong>
                      Solution Review
                    </strong>

                    <p>
                      Review university solutions submitted
                      for approved civic problems.
                    </p>

                  </div>

                  <span className="enabled">
                    Enabled
                  </span>

                </div>

                <div className="access-item">

                  <div className="access-icon">
                    C
                  </div>

                  <div>

                    <strong>
                      Company Coordination
                    </strong>

                    <p>
                      Coordinate approved solutions with
                      suitable companies.
                    </p>

                  </div>

                  <span className="enabled">
                    Enabled
                  </span>

                </div>

              </div>

            </div>

            <div className="settings-card security-card">

              <div className="settings-card-header">

                <div>

                  <p className="card-label">
                    ACCOUNT SECURITY
                  </p>

                  <h2>
                    Security
                  </h2>

                  <p>
                    Your Civiora account is protected through
                    authenticated access.
                  </p>

                </div>

              </div>

              <div className="security-row">

                <div>

                  <strong>
                    Authentication
                  </strong>

                  <p>
                    Your account uses secure Civiora
                    authentication.
                  </p>

                </div>

                <span className="security-badge">
                  Protected
                </span>

              </div>

            </div>

            <div className="settings-card danger-card">

              <div>

                <p className="card-label">
                  ACCOUNT ACTION
                </p>

                <h2>
                  Sign out
                </h2>

                <p>
                  Sign out from this Government Civiora
                  account on this device.
                </p>

              </div>

              <button
                className="settings-logout-button"
                onClick={handleLogout}
              >
                Sign Out
              </button>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Settings;