import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

      if (resetError) {
        throw resetError;
      }

      setMessage(
        "If an account exists with this email, a password reset link has been sent."
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Unable to send the password reset email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-brand">
        <Link to="/">CIVIORA</Link>
      </div>

      <div className="auth-container">
        <div className="auth-card">

          <div className="auth-header">
            <span>PASSWORD RECOVERY</span>

            <h1>Forgot your password?</h1>

            <p>
              Enter your email address and we'll send you
              a secure password reset link.
            </p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {message && (
            <div className="auth-success">
              {message}
            </div>
          )}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
              />
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}
            </button>

          </form>

          <p className="auth-footer-text">
            Remember your password?{" "}
            <Link to="/login">Sign in</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;