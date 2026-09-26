import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./Notifications.css";
import "./GovernmentNavbar.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
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
    } catch (err) {
      console.error(err);
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({
          is_read: true,
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                is_read: true,
              }
            : notification
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const {
        data: { user },
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

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  return (
    <div className="government-notifications-page">

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

        <div className="notifications-header">

          <div>

            <p className="notifications-label">
              GOVERNMENT WORKSPACE
            </p>

            <h1 className="notifications-title">
              Notifications
            </h1>

            <p className="notifications-subtitle">
              Stay updated about problems, solutions, companies and meetings.
            </p>

          </div>

          <button
            className="notifications-refresh-button"
            onClick={loadNotifications}
          >
            Refresh
          </button>

        </div>


        {/* SUMMARY */}

        <div className="notification-stats">

          <div className="notification-stat-card">

            <span>
              TOTAL NOTIFICATIONS
            </span>

            <strong>
              {notifications.length}
            </strong>

          </div>


          <div className="notification-stat-card">

            <span>
              UNREAD
            </span>

            <strong className="unread-number">
              {unreadCount}
            </strong>

          </div>

        </div>


        {/* ACTION BAR */}

        {!loading &&
          !error &&
          notifications.length > 0 && (

          <div className="notification-actions">

            <div>

              <h2>
                Recent Notifications
              </h2>

              <p>
                {unreadCount > 0
                  ? `${unreadCount} notification${
                      unreadCount > 1 ? "s" : ""
                    } require your attention.`
                  : "All notifications have been read."}
              </p>

            </div>

            {unreadCount > 0 && (
              <button
                className="mark-all-button"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}

          </div>
        )}


        {/* LOADING */}

        {loading && (
          <div className="notifications-message">
            Loading notifications...
          </div>
        )}


        {/* ERROR */}

        {!loading && error && (
          <div className="notifications-error">
            {error}
          </div>
        )}


        {/* EMPTY */}

        {!loading &&
          !error &&
          notifications.length === 0 && (

          <div className="notifications-empty">

            <div className="notification-empty-icon">
              ✓
            </div>

            <h2>
              No notifications
            </h2>

            <p>
              Government updates and important workflow
              events will appear here.
            </p>

          </div>
        )}


        {/* NOTIFICATION LIST */}

        {!loading &&
          !error &&
          notifications.length > 0 && (

          <div className="notifications-list">

            {notifications.map((notification) => (

              <div
                key={notification.id}
                className={`notification-card ${
                  notification.is_read
                    ? "read"
                    : "unread"
                }`}
              >

                <div className="notification-icon">
                  {notification.is_read ? "✓" : "!"}
                </div>


                <div className="notification-content">

                  <div className="notification-top">

                    <div>

                      <h3>
                        {notification.title ||
                          "Civiora Notification"}
                      </h3>

                      {!notification.is_read && (
                        <span className="new-badge">
                          NEW
                        </span>
                      )}

                    </div>

                    <span className="notification-date">
                      {formatDate(
                        notification.created_at
                      )}
                    </span>

                  </div>


                  <p>
                    {notification.message ||
                      "You have a new update from the Civiora platform."}
                  </p>


                  {!notification.is_read && (

                    <button
                      className="mark-read-button"
                      onClick={() =>
                        markAsRead(notification.id)
                      }
                    >
                      Mark as read
                    </button>

                  )}

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