import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./Opportunities.css";

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOpportunities = async () => {
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
        throw new Error("Company user is not logged in.");
      }

      const {
        data: company,
        error: companyError,
      } = await supabase
        .from("companies")
        .select("*")
        .eq("profile_id", user.id)
        .single();

      if (companyError) {
        throw companyError;
      }

      const {
        data: opportunityData,
        error: opportunityError,
      } = await supabase
        .from("company_opportunities")
        .select("*")
        .eq("company_id", company.id)
        .order("created_at", {
          ascending: false,
        });

      if (opportunityError) {
        throw opportunityError;
      }

      const completeOpportunities = [];

      for (const opportunity of opportunityData || []) {
        const {
          data: solution,
          error: solutionError,
        } = await supabase
          .from("solutions")
          .select("*")
          .eq("id", opportunity.solution_id)
          .single();

        if (solutionError) {
          console.error("Error loading solution:", solutionError);
          continue;
        }

        const {
          data: problem,
          error: problemError,
        } = await supabase
          .from("problems")
          .select("*")
          .eq("id", opportunity.problem_id)
          .single();

        if (problemError) {
          console.error("Error loading problem:", problemError);
          continue;
        }

        completeOpportunities.push({
          ...opportunity,
          solution,
          problem,
        });
      }

      setOpportunities(completeOpportunities);
    } catch (err) {
      console.error("Error fetching company opportunities:", err);
      setError("Unable to load company opportunities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const updateOpportunityStatus = async (
    opportunityId,
    status
  ) => {
    try {
      setError("");

      const response = await fetch(
        `/api/company-opportunities/${opportunityId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to update the opportunity."
        );
      }

      setOpportunities((currentOpportunities) =>
        currentOpportunities.map((opportunity) =>
          opportunity.id === opportunityId
            ? {
                ...opportunity,
                status: status,
                company_response:
                  status === "accepted"
                    ? "Company accepted the opportunity."
                    : "Company rejected the opportunity.",
                meeting: data.meeting || null,
              }
            : opportunity
        )
      );
    } catch (err) {
      console.error("Error updating opportunity:", err);
      setError(
        err.message || "Unable to update the opportunity."
      );
    }
  };

  if (loading) {
    return (
      <div className="company-opportunities-page">
        <div className="company-opportunities-loading">
          Loading opportunities...
        </div>
      </div>
    );
  }

  return (
    <div className="company-opportunities-page">
      <div className="company-opportunities-header">
        <div>
          <span className="company-opportunities-label">
            COMPANY IMPLEMENTATION OPPORTUNITIES
          </span>

          <h1>Opportunities</h1>

          <p>
            Review civic solutions matched to your company's
            capabilities.
          </p>
        </div>

        <div className="company-opportunity-count">
          {opportunities.length}
          <span>Opportunities</span>
        </div>
      </div>

      {error && (
        <div className="company-opportunities-error">
          {error}
        </div>
      )}

      {opportunities.length === 0 ? (
        <div className="company-empty-opportunities">
          <div className="company-empty-icon">○</div>

          <h2>No opportunities yet</h2>

          <p>
            When Civiora matches an approved solution with your
            company, the opportunity will appear here.
          </p>
        </div>
      ) : (
        <div className="company-opportunities-list">
          {opportunities.map((opportunity) => (
            <div
              className="company-opportunity-card"
              key={opportunity.id}
            >
              <div className="company-opportunity-top">
                <div>
                  <span className="company-opportunity-label">
                    CIVIC IMPLEMENTATION OPPORTUNITY
                  </span>

                  <h2>
                    {opportunity.problem?.title ||
                      "Civic Problem"}
                  </h2>
                </div>

                <span
                  className={`company-opportunity-status ${opportunity.status}`}
                >
                  {opportunity.status}
                </span>
              </div>

              <div className="company-opportunity-grid">
                <div className="company-opportunity-section">
                  <h3>Civic Problem</h3>

                  <p>
                    {opportunity.problem?.description ||
                      "No description available."}
                  </p>

                  <div className="company-opportunity-details">
                    <div>
                      <span>Category</span>
                      <strong>
                        {opportunity.problem?.category ||
                          "Not available"}
                      </strong>
                    </div>

                    <div>
                      <span>Location</span>
                      <strong>
                        {opportunity.problem?.location ||
                          "Not available"}
                      </strong>
                    </div>

                    <div>
                      <span>Priority</span>
                      <strong>
                        {opportunity.problem?.priority_rank
                          ? `#${opportunity.problem.priority_rank}`
                          : "Not ranked"}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="company-opportunity-section">
                  <h3>University Solution</h3>

                  <h4>
                    {opportunity.solution?.title ||
                      "Solution"}
                  </h4>

                  <p>
                    {opportunity.solution?.description ||
                      "No solution description available."}
                  </p>
                </div>
              </div>

              <div className="company-solution-details">
                <div>
                  <h3>Implementation Approach</h3>
                  <p>
                    {opportunity.solution?.approach ||
                      "Not available"}
                  </p>
                </div>

                <div>
                  <h3>Technologies</h3>
                  <p>
                    {opportunity.solution?.technologies ||
                      "Not available"}
                  </p>
                </div>

                <div>
                  <h3>Expected Impact</h3>
                  <p>
                    {opportunity.solution?.expected_impact ||
                      "Not available"}
                  </p>
                </div>
              </div>

              <div className="company-ai-match">
                <div>
                  <span className="company-ai-match-label">
                    CIVIORA AI MATCH
                  </span>

                  <strong>
                    {opportunity.match_score ?? 0}%
                  </strong>
                </div>

                <p>
                  {opportunity.match_reason ||
                    "No matching explanation available."}
                </p>
              </div>

              {opportunity.status === "pending" && (
                <div className="company-opportunity-actions">
                  <button
                    type="button"
                    className="company-reject-button"
                    onClick={() =>
                      updateOpportunityStatus(
                        opportunity.id,
                        "rejected"
                      )
                    }
                  >
                    Reject
                  </button>

                  <button
                    type="button"
                    className="company-accept-button"
                    onClick={() =>
                      updateOpportunityStatus(
                        opportunity.id,
                        "accepted"
                      )
                    }
                  >
                    Accept Opportunity
                  </button>
                </div>
              )}

              {opportunity.status === "accepted" && (
                <div className="company-opportunity-confirmation accepted">
                  Opportunity accepted. Meeting coordination
                  can proceed.

                  {opportunity.meeting && (
                    <div style={{ marginTop: "8px" }}>
                      Meeting scheduled for{" "}
                      {opportunity.meeting.meeting_date} at{" "}
                      {String(
                        opportunity.meeting.meeting_time
                      ).slice(0, 5)}
                      .
                    </div>
                  )}
                </div>
              )}

              {opportunity.status === "rejected" && (
                <div className="company-opportunity-confirmation rejected">
                  This opportunity was rejected by the company.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Opportunities;
