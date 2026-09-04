import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  CheckCircle,
  Clock,
  FileText,
  Building2,
  X,
} from "lucide-react";
import "./Notifications.css";

function Notifications() {
  const notifications = [
    {
      id: 1,
      type: "success",
      icon: <CheckCircle size={20} />,
      title: "Problem Submitted Successfully",
      message:
        "Your reported problem has been successfully submitted to Civiora and is now being analyzed.",
      time: "Today, 10:30 AM",
      unread: true,
    },
    {
      id: 2,
      type: "info",
      icon: <FileText size={20} />,
      title: "AI Analysis Completed",
      message:
        "Civiora AI has analyzed your problem and identified the required expertise and capabilities.",
      time: "Yesterday, 4:15 PM",
      unread: true,
    },
    {
      id: 3,
      type: "university",
      icon: <Building2 size={20} />,
      title: "University Matching in Progress",
      message:
        "Suitable universities are being identified based on their expertise, facilities and previous work.",
      time: "02 Sep 2026, 2:40 PM",
      unread: false,
    },
    {
      id: 4,
      type: "pending",
      icon: <Clock size={20} />,
      title: "Problem Under Review",
      message:
        "Your problem is currently being processed. You will receive an update when a suitable institution is assigned.",
      time: "01 Sep 2026, 11:20 AM",
      unread: false,
    },
  ];

  return (
    <div className="citizen-notifications-page">
      {/* Navbar */}
      <nav className="notifications-navbar">
        <Link to="/citizen" className="notifications-logo">
          Civiora
        </Link>

        <div className="notifications-nav-links">
          <Link to="/citizen">Home</Link>

          <Link to="/citizen/submit">Submit Problem</Link>

          <Link to="/citizen/myproblems">My Problems</Link>

          <Link to="/citizen/notifications" className="active">
            <Bell size={17} />
            Notifications
          </Link>

          <Link to="/citizen/settings">Settings</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="notifications-content">
        <Link to="/citizen" className="notifications-back-link">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="notifications-heading">
          <div>
            <h1>Notifications</h1>
            <p>
              Stay updated about your submitted problems and Civiora activity.
            </p>
          </div>

          <button className="mark-read-button">
            Mark all as read
          </button>
        </div>

        {/* Notification Summary */}
        <div className="notification-summary">
          <div className="summary-item">
            <span className="summary-number">2</span>
            <span className="summary-label">Unread</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-item">
            <span className="summary-number">{notifications.length}</span>
            <span className="summary-label">Total Notifications</span>
          </div>
        </div>

        {/* Notifications List */}
        <section className="notifications-section">
          <div className="notifications-section-header">
            <h2>Recent Notifications</h2>
          </div>

          <div className="notifications-list">
            {notifications.map((notification) => (
              <div
                className={`notification-card ${
                  notification.unread ? "unread" : ""
                }`}
                key={notification.id}
              >
                <div className={`notification-icon ${notification.type}`}>
                  {notification.icon}
                </div>

                <div className="notification-body">
                  <div className="notification-title-row">
                    <h3>{notification.title}</h3>

                    {notification.unread && (
                      <span className="unread-dot"></span>
                    )}
                  </div>

                  <p>{notification.message}</p>

                  <span className="notification-time">
                    {notification.time}
                  </span>
                </div>

                <button
                  className="notification-close"
                  aria-label="Remove notification"
                >
                  <X size={17} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="notifications-footer">
        <p>
          © 2026 Civiora. Connecting citizens, institutions and solutions.
        </p>
      </footer>
    </div>
  );
}

export default Notifications;
