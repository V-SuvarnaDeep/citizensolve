import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Check,
  CheckCheck,
  Info,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
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
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("University session not found");
      }

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false
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

  const markAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({
          is_read: true
        })
        .eq("id", notificationId);

      if (error) {
        throw error;
      }

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                is_read: true
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
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const { error } = await supabase
        .from("notifications")
        .update({
          is_read: true
        })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) {
        throw error;
      }

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          is_read: true
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getNotificationIcon = (type) => {
    if (type === "success") {
      return <CheckCircle size={20} />;
    }

    if (type === "warning") {
      return <AlertCircle size={20} />;
    }

    if (type === "info") {
      return <Info size={20} />;
    }

    return <Bell size={20} />;
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter(
          (notification) => !notification.is_read
        )
      : notifications;

  return (
    <div className="university-notifications-page">

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

          <Link
            to="/university/notifications"
            className="active"
          >
            Notifications
          </Link>

          <Link to="/university/settings">
            Settings
          </Link>

        </div>

        <Link
          to="/login"
          className="university-logout"
        >
          Logout
        </Link>

      </nav>

      <main className="notifications-content">

        <div className="notifications-header">

          <div>

            <p className="notifications-label">
              UNIVERSITY UPDATES
            </p>

            <h1>
              Notifications
            </h1>

            <p>
              Stay updated about civic problem allocations,
              solution reviews and important Civiora activities.
            </p>

          </div>

          <div className="notification-summary">

            <div className="notification-summary-icon">
              <Bell size={22} />
            </div>

            <div>

              <strong>
                {unreadCount}
              </strong>

              <span>
                Unread
              </span>

            </div>

          </div>

        </div>

        <div className="notifications-toolbar">

          <div className="notification-filters">

            <button
              className={
                filter === "all"
                  ? "notification-filter active"
                  : "notification-filter"
              }
              onClick={() => setFilter("all")}
            >
              All
            </button>

            <button
              className={
                filter === "unread"
                  ? "notification-filter active"
                  : "notification-filter"
              }
              onClick={() => setFilter("unread")}
            >
              Unread
              {unreadCount > 0 && (
                <span className="filter-count">
                  {unreadCount}
                </span>
              )}
            </button>

          </div>

          {unreadCount > 0 && (

            <button
              className="mark-all-button"
              onClick={markAllAsRead}
            >
              <CheckCheck size={17} />
              Mark all as read
            </button>

          )}

        </div>

        {loading && (

          <div className="notification-state">

            <Clock size={24} />

            <h3>
              Loading notifications...
            </h3>

            <p>
              Please wait while we load your latest updates.
            </p>

          </div>

        )}

        {!loading && error && (

          <div className="notification-state error">

            <AlertCircle size={24} />

            <h3>
              Something went wrong
            </h3>

            <p>
              {error}
            </p>

            <button
              onClick={loadNotifications}
              className="retry-button"
            >
              Try Again
            </button>

          </div>

        )}

        {!loading &&
          !error &&
          filteredNotifications.length === 0 && (

            <div className="notification-state">

              <div className="empty-notification-icon">
                <Bell size={28} />
              </div>

              <h3>
                {filter === "unread"
                  ? "No unread notifications"
                  : "No notifications yet"}
              </h3>

              <p>
                {filter === "unread"
                  ? "You're all caught up."
                  : "New university updates will appear here."}
              </p>

            </div>

          )}

        {!loading &&
          !error &&
          filteredNotifications.length > 0 && (

            <div className="notifications-list">

              {filteredNotifications.map(
                (notification) => (

                  <div
                    key={notification.id}
                    className={
                      notification.is_read
                        ? "notification-card"
                        : "notification-card unread"
                    }
                  >

                    <div
                      className={`notification-icon ${
                        notification.type || "info"
                      }`}
                    >
                      {getNotificationIcon(
                        notification.type
                      )}
                    </div>

                    <div className="notification-body">

                      <div className="notification-top">

                        <div>

                          <h3>
                            {notification.title}
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
                        {notification.message}
                      </p>

                      <div className="notification-bottom">

                        <span className="notification-type">
                          {notification.type ||
                            "information"}
                        </span>

                        {!notification.is_read && (

                          <button
                            className="read-button"
                            onClick={() =>
                              markAsRead(
                                notification.id
                              )
                            }
                          >
                            <Check size={16} />
                            Mark as read
                          </button>

                        )}

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

      </main>

    </div>
  );
}

export default Notifications;