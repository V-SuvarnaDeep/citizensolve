import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../../api";
import {
  ArrowLeft,
  Bell,
  CheckCircle,
  Clock,
  FileText,
  Building2,
  X,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        setError("");

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setError(
            "Your session has expired. Please sign in again."
          );
          return;
        }

        const response = await fetch(
          `${API_URL}/citizen/notifications`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Your session is no longer valid. Please sign in again."
            );
          }

          throw new Error(
            "Unable to load your notifications."
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            "Unable to load your notifications."
          );
        }

        setNotifications(
          result.notifications || []
        );

      } catch (err) {
        console.error(
          "Loading notifications error:",
          err
        );

        setError(
          err.message ||
            "Something went wrong while loading notifications."
        );
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const getNotificationIcon = (type) => {
    if (type === "success") {
      return <CheckCircle size={20} />;
    }

    if (type === "university") {
      return <Building2 size={20} />;
    }

    if (type === "pending") {
      return <Clock size={20} />;
    }

    return <FileText size={20} />;
  };

  const getNotificationType = (type) => {
    if (
      type === "success" ||
      type === "university" ||
      type === "pending"
    ) {
      return type;
    }

    return "info";
  };

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const markAsRead = async (notificationId) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return;
      }

      const response = await fetch(
        `${API_URL}/citizen/notifications/read-all`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to update notification."
        );
      }

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                is_read: true,
              }
            : notification
        )
      );

    } catch (err) {
      console.error(
        "Mark notification error:",
        err
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return;
      }

      const response = await fetch(
        `${API_URL}/citizen/notifications/read-all`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to mark notifications as read."
        );
      }

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );

    } catch (err) {
      console.error(
        "Mark all notifications error:",
        err
      );
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  return (
    <div className="citizen-notifications-page">

      {/* Navbar */}
      <nav className="notifications-navbar">

        <Link
          to="/citizen"
          className="notifications-logo"
        >
          Civiora
        </Link>

        <div className="notifications-nav-links">

          <Link to="/citizen">
            Home
          </Link>

          <Link to="/citizen/submit">
            Submit Problem
          </Link>

          <Link to="/citizen/myproblems">
            My Problems
          </Link>

          <Link
            to="/citizen/notifications"
            className="active"
          >
            <Bell size={17} />
            Notifications
          </Link>

          <Link to="/citizen/settings">
            Settings
          </Link>

        </div>

      </nav>

      {/* Main Content */}
      <main className="notifications-content">

        <Link
          to="/citizen"
          className="notifications-back-link"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="notifications-heading">

          <div>

            <h1>
              Notifications
            </h1>

            <p>
              Stay updated about your submitted problems
              and Civiora activity.
            </p>

          </div>

          <button
            className="mark-read-button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </button>

        </div>

        {/* Notification Summary */}
        <div className="notification-summary">

          <div className="summary-item">

            <span className="summary-number">
              {unreadCount}
            </span>

            <span className="summary-label">
              Unread
            </span>

          </div>

          <div className="summary-divider"></div>

          <div className="summary-item">

            <span className="summary-number">
              {notifications.length}
            </span>

            <span className="summary-label">
              Total Notifications
            </span>

          </div>

        </div>

        {/* Notifications List */}
        <section className="notifications-section">

          <div className="notifications-section-header">

            <h2>
              Recent Notifications
            </h2>

          </div>

          {loading && (
            <div className="notification-message">
              Loading notifications...
            </div>
          )}

          {!loading && error && (
            <div className="notification-message error-message">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            notifications.length === 0 && (
              <div className="notification-message">
                You don't have any notifications yet.
              </div>
            )}

          {!loading &&
            !error &&
            notifications.length > 0 && (

              <div className="notifications-list">

                {notifications.map(
                  (notification) => {

                    const notificationType =
                      getNotificationType(
                        notification.type
                      );

                    return (
                      <div
                        className={`notification-card ${
                          !notification.is_read
                            ? "unread"
                            : ""
                        }`}
                        key={notification.id}
                      >

                        <div
                          className={`notification-icon ${notificationType}`}
                        >
                          {getNotificationIcon(
                            notification.type
                          )}
                        </div>

                        <div className="notification-body">

                          <div className="notification-title-row">

                            <h3>
                              {notification.title}
                            </h3>

                            {!notification.is_read && (
                              <span className="unread-dot"></span>
                            )}

                          </div>

                          <p>
                            {notification.message}
                          </p>

                          <span className="notification-time">
                            {formatTime(
                              notification.created_at
                            )}
                          </span>

                        </div>

                        {!notification.is_read && (
                          <button
                            className="notification-close"
                            aria-label="Mark notification as read"
                            onClick={() =>
                              markAsRead(
                                notification.id
                              )
                            }
                          >
                            <X size={17} />
                          </button>
                        )}

                      </div>
                    );
                  }
                )}

              </div>

            )}

        </section>

      </main>

      {/* Footer */}
      <footer className="notifications-footer">

        <p>
          © 2026 Civiora. Connecting citizens,
          institutions and solutions.
        </p>

      </footer>

    </div>
  );
}

export default Notifications;