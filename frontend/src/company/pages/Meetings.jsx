import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./Meetings.css";

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

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setError("Please login to view your meetings.");
        return;
      }

      // Get company connected to the logged-in profile
      const { data: company, error: companyError } = await supabase
        .from("companies")
        .select("*")
        .eq("profile_id", user.id)
        .single();

      if (companyError) {
        throw companyError;
      }

      // Get all meetings for this company
      const { data: meetingData, error: meetingError } = await supabase
        .from("meetings")
        .select("*")
        .eq("company_id", company.id)
        .order("meeting_date", { ascending: true })
        .order("meeting_time", { ascending: true });

      if (meetingError) {
        throw meetingError;
      }

      const meetingsWithDetails = [];

      for (const meeting of meetingData || []) {
        let problem = null;
        let solution = null;

        const { data: problemData } = await supabase
          .from("problems")
          .select("title, description, category, location")
          .eq("id", meeting.problem_id)
          .single();

        const { data: solutionData } = await supabase
          .from("solutions")
          .select("title, description, approach, technologies")
          .eq("id", meeting.solution_id)
          .single();

        problem = problemData;
        solution = solutionData;

        meetingsWithDetails.push({
          ...meeting,
          problem,
          solution,
        });
      }

      setMeetings(meetingsWithDetails);
    } catch (err) {
      console.error("Error loading meetings:", err);
      setError(err.message || "Unable to load meetings.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "Time not available";

    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusClass = (status) => {
    if (status === "scheduled") return "status-scheduled";
    if (status === "completed") return "status-completed";
    if (status === "cancelled") return "status-cancelled";

    return "status-default";
  };

  if (loading) {
    return (
      <div className="meetings-page">
        <div className="meetings-header">
          <h1>Company Meetings</h1>
          <p>View your scheduled implementation meetings.</p>
        </div>

        <div className="meetings-loading">
          Loading meetings...
        </div>
      </div>
    );
  }

  return (
    <div className="meetings-page">
      <div className="meetings-header">
        <div>
          <h1>Company Meetings</h1>
          <p>
            View meetings scheduled for approved Civiora solutions.
          </p>
        </div>

        <button className="refresh-button" onClick={loadMeetings}>
          Refresh
        </button>
      </div>

      {error && (
        <div className="meetings-error">
          {error}
        </div>
      )}

      {!error && meetings.length === 0 && (
        <div className="empty-meetings">
          <div className="empty-icon">📅</div>

          <h2>No meetings scheduled yet</h2>

          <p>
            When your company accepts an implementation opportunity,
            Civiora AI will schedule a suitable meeting automatically.
          </p>
        </div>
      )}

      <div className="meetings-list">
        {meetings.map((meeting) => (
          <div className="meeting-card" key={meeting.id}>
            <div className="meeting-card-header">
              <div>
                <span className="meeting-label">
                  CIVIORA IMPLEMENTATION MEETING
                </span>

                <h2>
                  {meeting.meeting_title}
                </h2>
              </div>

              <span
                className={`meeting-status ${getStatusClass(
                  meeting.status
                )}`}
              >
                {meeting.status}
              </span>
            </div>

            <div className="meeting-date-box">
              <div className="date-item">
                <span className="date-label">DATE</span>
                <strong>
                  {formatDate(meeting.meeting_date)}
                </strong>
              </div>

              <div className="date-item">
                <span className="date-label">TIME</span>
                <strong>
                  {formatTime(meeting.meeting_time)}
                </strong>
              </div>
            </div>

            {meeting.problem && (
              <div className="meeting-section">
                <h3>Civic Problem</h3>

                <h4>
                  {meeting.problem.title}
                </h4>

                <p>
                  {meeting.problem.description}
                </p>

                <div className="meeting-meta">
                  <span>
                    Category: {meeting.problem.category || "N/A"}
                  </span>

                  <span>
                    Location: {meeting.problem.location || "N/A"}
                  </span>
                </div>
              </div>
            )}

            {meeting.solution && (
              <div className="meeting-section">
                <h3>University Solution</h3>

                <h4>
                  {meeting.solution.title}
                </h4>

                <p>
                  {meeting.solution.description}
                </p>

                {meeting.solution.approach && (
                  <div className="solution-detail">
                    <strong>Approach</strong>
                    <p>{meeting.solution.approach}</p>
                  </div>
                )}

                {meeting.solution.technologies && (
                  <div className="solution-detail">
                    <strong>Technologies</strong>
                    <p>{meeting.solution.technologies}</p>
                  </div>
                )}
              </div>
            )}

            <div className="meeting-section">
              <h3>Meeting Purpose</h3>

              <p>
                {meeting.purpose}
              </p>
            </div>

            {meeting.ai_reason && (
              <div className="ai-reason">
                <div className="ai-reason-title">
                  ✨ AI Scheduling Reason
                </div>

                <p>
                  {meeting.ai_reason}
                </p>
              </div>
            )}

            <div className="meeting-section">
              <h3>Meeting Agenda</h3>

              {meeting.agenda && meeting.agenda.length > 0 ? (
                <ol className="agenda-list">
                  {meeting.agenda.map((item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  ))}
                </ol>
              ) : (
                <p>No agenda available.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Meetings;