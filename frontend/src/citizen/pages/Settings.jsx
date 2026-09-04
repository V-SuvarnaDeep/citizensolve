import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  User,
  Lock,
  Save,
  LogOut,
} from "lucide-react";
import "./Settings.css";

function Settings() {
  const [profile, setProfile] = useState({
    name: "Citizen User",
    email: "citizen@example.com",
    phone: "",
    location: "",
  });

  const [notifications, setNotifications] = useState({
    problemUpdates: true,
    universityUpdates: true,
    governmentUpdates: true,
    emailNotifications: false,
  });

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleNotificationChange = (event) => {
    const { name, checked } = event.target;

    setNotifications({
      ...notifications,
      [name]: checked,
    });
  };

  const handleSave = (event) => {
    event.preventDefault();

    console.log("Profile:", profile);
    console.log("Notifications:", notifications);

    alert("Settings saved successfully!");
  };

  return (
    <div className="citizen-settings-page">
      {/* Navbar */}
      <nav className="settings-navbar">
        <Link to="/citizen" className="settings-logo">
          Civiora
        </Link>

        <div className="settings-nav-links">
          <Link to="/citizen">Home</Link>

          <Link to="/citizen/submit">Submit Problem</Link>

          <Link to="/citizen/myproblems">My Problems</Link>

          <Link to="/citizen/notifications">
            <Bell size={17} />
            Notifications
          </Link>

          <Link to="/citizen/settings" className="active">
            Settings
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="settings-content">
        <Link to="/citizen" className="settings-back-link">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="settings-heading">
          <h1>Settings</h1>
          <p>
            Manage your profile, notifications and account preferences.
          </p>
        </div>

        <form onSubmit={handleSave} className="settings-form">
          {/* Profile */}
          <section className="settings-card">
            <div className="settings-card-heading">
              <div className="settings-heading-icon">
                <User size={20} />
              </div>

              <div>
                <h2>Profile Information</h2>
                <p>Update your personal information.</p>
              </div>
            </div>

            <div className="settings-fields">
              <div className="settings-field">
                <label htmlFor="name">Full Name</label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="settings-field">
                <label htmlFor="email">Email Address</label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="settings-field">
                <label htmlFor="phone">Phone Number</label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="settings-field">
                <label htmlFor="location">Location</label>

                <input
                  id="location"
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleProfileChange}
                  placeholder="City / Area"
                />
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="settings-card">
            <div className="settings-card-heading">
              <div className="settings-heading-icon">
                <Bell size={20} />
              </div>

              <div>
                <h2>Notification Preferences</h2>
                <p>Choose which updates you want to receive.</p>
              </div>
            </div>

            <div className="notification-settings">
              <label className="notification-setting">
                <div>
                  <strong>Problem Updates</strong>
                  <span>
                    Receive updates about problems you have submitted.
                  </span>
                </div>

                <input
                  type="checkbox"
                  name="problemUpdates"
                  checked={notifications.problemUpdates}
                  onChange={handleNotificationChange}
                />
              </label>

              <label className="notification-setting">
                <div>
                  <strong>University Updates</strong>
                  <span>
                    Get notified when a university is assigned or responds.
                  </span>
                </div>

                <input
                  type="checkbox"
                  name="universityUpdates"
                  checked={notifications.universityUpdates}
                  onChange={handleNotificationChange}
                />
              </label>

              <label className="notification-setting">
                <div>
                  <strong>Government Updates</strong>
                  <span>
                    Receive updates when your problem reaches government
                    review.
                  </span>
                </div>

                <input
                  type="checkbox"
                  name="governmentUpdates"
                  checked={notifications.governmentUpdates}
                  onChange={handleNotificationChange}
                />
              </label>

              <label className="notification-setting">
                <div>
                  <strong>Email Notifications</strong>
                  <span>
                    Receive important Civiora updates through email.
                  </span>
                </div>

                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={notifications.emailNotifications}
                  onChange={handleNotificationChange}
                />
              </label>
            </div>
          </section>

          {/* Security */}
          <section className="settings-card">
            <div className="settings-card-heading">
              <div className="settings-heading-icon">
                <Lock size={20} />
              </div>

              <div>
                <h2>Security</h2>
                <p>Manage your account security.</p>
              </div>
            </div>

            <div className="security-row">
              <div>
                <strong>Password</strong>
                <span>
                  Change your password to keep your account secure.
                </span>
              </div>

              <button
                type="button"
                className="change-password-button"
                onClick={() => alert("Password change will be connected later.")}
              >
                Change Password
              </button>
            </div>
          </section>

          {/* Account */}
          <section className="settings-card account-card">
            <div className="settings-card-heading">
              <div>
                <h2>Account</h2>
                <p>Manage your Civiora account.</p>
              </div>
            </div>

            <button
              type="button"
              className="logout-button"
              onClick={() => alert("Logout will be connected later.")}
            >
              <LogOut size={17} />
              Logout
            </button>
          </section>

          {/* Save */}
          <div className="settings-actions">
            <button type="submit" className="save-settings-button">
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="settings-footer">
        <p>
          © 2026 Civiora. Connecting citizens, institutions and solutions.
        </p>
      </footer>
    </div>
  );
}

export default Settings;