import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./Home.css";

function Home() {
  const [profile, setProfile] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      const { data: companyData } = await supabase
        .from("companies")
        .select("*")
        .eq("profile_id", user.id)
        .maybeSingle();

      setCompany(companyData);
    } catch (error) {
      console.error("Error loading company data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="company-loading">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="company-page">

      <nav className="company-navbar">
        <Link to="/company" className="company-logo">
          CIVIORA
        </Link>

        <div className="company-nav-links">
          <Link to="/company" className="active">
            Dashboard
          </Link>

          <Link to="/company/opportunities">
            Opportunities
          </Link>

          <Link to="/company/solutions">
            Solutions
          </Link>

          <Link to="/company/meetings">
            Meetings
          </Link>

          <Link to="/company/notifications">
            Notifications
          </Link>

          <Link to="/company/settings">
            Settings
          </Link>
        </div>

        <Link to="/login" className="company-logout">
          Logout
        </Link>
      </nav>

      <main className="company-dashboard">

        <section className="company-welcome">
          <div>
            <p className="company-label">
              COMPANY DASHBOARD
            </p>

            <h1>
              Welcome, {company?.company_name || profile?.name || "Company"}
            </h1>

            <p>
              Explore civic opportunities matched to your company's
              expertise and technologies.
            </p>
          </div>

          <Link
            to="/company/profile"
            className="company-profile-button"
          >
            {company ? "View Company Profile" : "Complete Company Profile"}
          </Link>
        </section>

        <section className="company-stats">

          <div className="company-stat-card">
            <div className="company-stat-icon">
              O
            </div>

            <div>
              <span>Opportunities</span>
              <strong>0</strong>
            </div>
          </div>

          <div className="company-stat-card">
            <div className="company-stat-icon">
              S
            </div>

            <div>
              <span>Active Solutions</span>
              <strong>0</strong>
            </div>
          </div>

          <div className="company-stat-card">
            <div className="company-stat-icon">
              M
            </div>

            <div>
              <span>Meetings</span>
              <strong>0</strong>
            </div>
          </div>

          <div className="company-stat-card">
            <div className="company-stat-icon">
              N
            </div>

            <div>
              <span>Notifications</span>
              <strong>0</strong>
            </div>
          </div>

        </section>

        <section className="company-content-grid">

          <div className="company-main-card">
            <div className="company-card-header">
              <div>
                <p className="company-section-label">
                  AI MATCHING
                </p>

                <h2>Company Opportunities</h2>
              </div>

              <Link to="/company/opportunities">
                View All
              </Link>
            </div>

            <div className="company-empty-state">
              <div className="company-empty-icon">
                AI
              </div>

              <h3>No opportunities yet</h3>

              <p>
                When the Government approves a civic solution,
                Civiora AI will identify companies whose expertise
                and capabilities match the solution.
              </p>
            </div>
          </div>

          <div className="company-side-card">

            <p className="company-section-label">
              COMPANY PROFILE
            </p>

            <h2>Profile Status</h2>

            {company ? (
              <>
                <div className="company-profile-status complete">
                  <span></span>
                  Profile Completed
                </div>

                <p>
                  Your company profile is available for AI-based
                  opportunity matching.
                </p>

                <Link to="/company/profile">
                  Manage Profile →
                </Link>
              </>
            ) : (
              <>
                <div className="company-profile-status incomplete">
                  <span></span>
                  Profile Not Completed
                </div>

                <p>
                  Complete your company details so Civiora can
                  match your company with relevant civic solutions.
                </p>

                <Link to="/company/profile">
                  Complete Profile →
                </Link>
              </>
            )}

          </div>

        </section>

        <section className="company-info-section">

          <div className="company-info-card">
            <p className="company-section-label">
              HOW IT WORKS
            </p>

            <h2>From Civic Problem to Implementation</h2>

            <div className="company-flow">

              <div className="company-flow-item">
                <span>01</span>
                <div>
                  <strong>Solution Approved</strong>
                  <p>
                    Government reviews and approves a university solution.
                  </p>
                </div>
              </div>

              <div className="company-flow-item">
                <span>02</span>
                <div>
                  <strong>AI Company Matching</strong>
                  <p>
                    Civiora analyzes company capabilities and finds a
                    suitable implementation partner.
                  </p>
                </div>
              </div>

              <div className="company-flow-item">
                <span>03</span>
                <div>
                  <strong>Company Acceptance</strong>
                  <p>
                    The matched company reviews the opportunity and
                    accepts or rejects it.
                  </p>
                </div>
              </div>

              <div className="company-flow-item">
                <span>04</span>
                <div>
                  <strong>Implementation Meeting</strong>
                  <p>
                    Accepted opportunities move toward meeting and
                    implementation.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </section>

      </main>
    </div>
  );
}

export default Home;