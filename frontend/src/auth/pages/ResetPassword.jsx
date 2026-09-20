import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./ResetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const { error: updateError } =
        await supabase.auth.updateUser({
          password: password,
        });

      if (updateError) {
        throw updateError;
      }

      setMessage(
        "Your password has been updated successfully."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Unable to update your password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-brand">
        <span>CIVIORA</span>
      </div>

      <div className="auth-container">
        <div className="auth-card">

          <div className="auth-header">
            <span>SECURE ACCOUNT</span>

            <h1>Create a new password</h1>

            <p>
              Choose a new password for your Civiora account.
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
              <label>New Password</label>

              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                minLength="6"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>

              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                minLength="6"
                required
              />
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading
                ? "Updating..."
                : "Update Password"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default ResetPassword;