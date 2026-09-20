import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      if (loginError) {
        throw loginError;
      }

     const role = data.user?.user_metadata?.role;

if (role === "citizen") {
  navigate("/citizen");
} else if (role === "university") {
  navigate("/university");
} else if (role === "government") {
  navigate("/government");
} else if (role === "company") {
  navigate("/company");
} else {
  await supabase.auth.signOut();

  setError(
    "Your account does not have a valid Civiora role."
  );
}

    } catch (err) {
      console.error(err);

      if (
        err.message?.toLowerCase().includes("email not confirmed")
      ) {
        setError(
          "Please verify your email address before signing in."
        );
      } else if (
        err.message?.toLowerCase().includes("invalid login credentials")
      ) {
        setError("Incorrect email or password.");
      } else {
        setError(
          err.message || "Unable to sign in."
        );
      }
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
            <span>WELCOME BACK</span>

            <h1>Sign in to Civiora</h1>

            <p>
              Continue your journey towards solving real-world problems.
            </p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
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
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-options">

              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="forgot-password"
              >
                Forgot password?
              </Link>

            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>

          <p className="auth-footer-text">
            Don't have an account?{" "}
            <Link to="/register">
              Create an account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;