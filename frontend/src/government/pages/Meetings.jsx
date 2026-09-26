import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./Meetings.css";
import "./GovernmentNavbar.css";

function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .order("meeting_date", {
          ascending: true,
        })
        .order("meeting_time", {
          ascending: true,
        });

      if (error) {
        throw error;
      }

      setMeetings(data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load government meetings.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) {
      return "—";
    }

    const [hours, minutes] = time
      .split(":")
      .map(Number);

    const date = new Date();

    date.setHours(hours);
    date.setMinutes(minutes);

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (value === "scheduled") {
      return "meeting-status scheduled";
    }

    if (value === "completed") {
      return "meeting-status completed";
    }

    if (value === "cancelled") {
      return "meeting-status cancelled";
    }

    return "meeting-status";
  };

  const scheduledMeetings = meetings.filter(
    (meeting) =>
      String(meeting.status || "").toLowerCase() ===
      "scheduled"
  );

  const completedMeetings = meetings.filter(
    (meeting) =>
      String(meeting.status || "").toLowerCase() ===
      "completed"
  );

  return (
    <div className="government-meetings-page">

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
            Home
          </Link>

          <Link to="/government/problems">
            Problems
          </Link>

          <Link to="/government/solutions">
            Solutions
          </Link>

          <Link
            to="/government/meetings"
            className="active"
          >
            Meetings
          </Link>

          <Link to="/government/notifications">
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


      {/* MAIN CONTENT */}

      <main className="government-meetings-content">

        <div className="meetings-header">

          <div>

            <p className="meetings-label">
              GOVERNMENT WORKSPACE
            </p>

            <h1 className="meetings-title">
              Government Meetings
            </h1>

            <p className="meetings-subtitle">
              Meetings scheduled between government and implementation companies
            </p>

          </div>

          <button
            className="meetings-refresh-button"
            onClick={loadMeetings}
          >
            Refresh
          </button>

        </div>


        {/* SUMMARY */}

        <div className="meeting-stats">

          <div className="meeting-stat-card">

            <span className="meeting-stat-label">
              TOTAL MEETINGS
            </span>

            <strong>
              {meetings.length}
            </strong>

          </div>


          <div className="meeting-stat-card">

            <span className="meeting-stat-label">
              SCHEDULED
            </span>

            <strong>
              {scheduledMeetings.length}
            </strong>

          </div>


          <div className="meeting-stat-card">

            <span className="meeting-stat-label">
              COMPLETED
            </span>

            <strong>
              {completedMeetings.length}
            </strong>

          </div>

        </div>


        {/* LOADING */}

        {loading && (
          <div className="meetings-message">
            Loading scheduled meetings...
          </div>
        )}


        {/* ERROR */}

        {!loading && error && (
          <div className="meetings-error">
            {error}
          </div>
        )}


        {/* EMPTY */}

        {!loading &&
          !error &&
          meetings.length === 0 && (
            <div className="meetings-empty">

              <div className="meetings-empty-icon">
                📅
              </div>

              <h2>
                No meetings scheduled
              </h2>

              <p>
                Company meetings will appear here after
                a company accepts a Civiora implementation opportunity.
              </p>

            </div>
          )}


        {/* MEETINGS */}

        {!loading &&
          !error &&
          meetings.length > 0 && (

            <div className="meetings-list">

              {meetings.map((meeting) => (

                <div
                  className="meeting-card"
                  key={meeting.id}
                >

                  <div className="meeting-card-header">

                    <div>

                      <span className="meeting-type">
                        IMPLEMENTATION MEETING
                      </span>

                      <h2>
                        {meeting.meeting_title ||
                          "Civiora Implementation Meeting"}
                      </h2>

                    </div>

                    <span
                      className={getStatusClass(
                        meeting.status
                      )}
                    >
                      {meeting.status ||
                        "Scheduled"}
                    </span>

                  </div>


                  <div className="meeting-details">

                    <div className="meeting-detail">

                      <span>
                        DATE
                      </span>

                      <strong>
                        {formatDate(
                          meeting.meeting_date
                        )}
                      </strong>

                    </div>


                    <div className="meeting-detail">

                      <span>
                        TIME
                      </span>

                      <strong>
                        {formatTime(
                          meeting.meeting_time
                        )}
                      </strong>

                    </div>


                    <div className="meeting-detail">

                      <span>
                        COMPANY
                      </span>

                      <strong>
                        {meeting.company_id
                          ? meeting.company_id
                          : "Company assigned"}
                      </strong>

                    </div>

                  </div>


                  <div className="meeting-purpose">

                    <span>
                      PURPOSE
                    </span>

                    <p>
                      {meeting.purpose ||
                        "Discuss the implementation of the approved civic solution."}
                    </p>

                  </div>


                  {meeting.agenda &&
                    meeting.agenda.length > 0 && (

                    <div className="meeting-agenda">

                      <span>
                        MEETING AGENDA
                      </span>

                      <ul>

                        {meeting.agenda.map(
                          (item, index) => (

                            <li key={index}>
                              {item}
                            </li>

                          )
                        )}

                      </ul>

                    </div>

                  )}

                </div>

              ))}

            </div>
          )}

      </main>

    </div>
  );
}

export default Meetings;