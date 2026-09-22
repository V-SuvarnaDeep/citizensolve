import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data: {
          user
        },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Please log in to view notifications.");
        return;
      }

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      setNotifications(data || []);
    } catch (error) {
      console.error(error);
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const markAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({
          is_read: true,
        })
        .eq("id", notificationId);

      if (error) {
        throw error;
      }

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                is_read: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const {
        data: {
          user
        },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const { error } = await supabase
        .from("notifications")
        .update({
          is_read: true,
        })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) {
        throw error;
      }

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleString();
  };

  return (
    <div className="government-notifications-page">

      {/* GOVERNMENT NAVBAR */}

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

          <Link
            to="/government/notifications"
            className="active"
          >
            Notifications
          </Link>

          <Link to="/government/settings">
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

      {/* CONTENT */}

      <main className="government-notifications-content">

        <div className="government-notifications-header">

          <div>

            <p className="government-notifications-label">
              GOVERNMENT UPDATES
            </p>

            <h1>
              Notifications
            </h1>

            <p>
              Stay updated about civic problems, university
              solutions, reviews and other important activities.
            </p>

          </div>

          {unreadCount > 0 && (
            <button
              className="mark-all-button"
              onClick={markAllAsRead}
            >
              Mark All as Read
            </button>
          )}

        </div>

        <div className="notification-summary">

          <div className="notification-summary-card">

            <strong>
              {notifications.length}
            </strong>

            <span>
              Total Notifications
            </span>

          </div>

          <div className="notification-summary-card">

            <strong className="unread-number">
              {unreadCount}
            </strong>

            <span>
              Unread Notifications
            </span>

          </div>

        </div>

        {loading && (
          <div className="notifications-message">
            Loading notifications...
          </div>
        )}

        {!loading && error && (
          <div className="notifications-error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          notifications.length === 0 && (
            <div className="notifications-empty">

              <div className="empty-icon">
                ✓
              </div>

              <h2>
                No notifications yet
              </h2>

              <p>
                Government notifications will appear here when
                there are important updates in the Civiora workflow.
              </p>

            </div>
          )}

        {!loading &&
          !error &&
          notifications.length > 0 && (
            <div className="notifications-list">

              {notifications.map((notification) => (

                <div
                  key={notification.id}
                  className={`notification-card ${
                    notification.is_read
                      ? "notification-read"
                      : "notification-unread"
                  }`}
                >

                  <div className="notification-icon">
                    {notification.is_read ? "✓" : "!"}
                  </div>

                  <div className="notification-content">

                    <div className="notification-top">

                      <div>

                        <h2>
                          {notification.title}
                        </h2>

                        {notification.type && (
                          <span className="notification-type">
                            {notification.type}
                          </span>
                        )}

                      </div>

                      {!notification.is_read && (
                        <span className="unread-badge">
                          New
                        </span>
                      )}

                    </div>

                    <p>
                      {notification.message}
                    </p>

                    <div className="notification-bottom">

                      <span>
                        {formatDate(notification.created_at)}
                      </span>

                      {!notification.is_read && (
                        <button
                          className="mark-read-button"
                          onClick={() =>
                            markAsRead(notification.id)
                          }
                        >
                          Mark as Read
                        </button>
                      )}

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

      </main>

    </div>
  );
}

export default Notifications;