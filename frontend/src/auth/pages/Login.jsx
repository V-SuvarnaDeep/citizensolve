import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Login data:", formData);
  };

  return (
    <div className="auth-page">

      {/* Brand */}
      <div className="auth-brand">
        <Link to="/">CIVIORA</Link>
      </div>

      <div className="auth-container">
        <div className="auth-card">

          {/* Header */}
          <div className="auth-header">
            <span>WELCOME BACK</span>

            <h1>Sign in to Civiora</h1>

            <p>
              Continue your journey towards solving real-world problems.
            </p>
          </div>

          {/* Login Form */}
          <form className="login-form" onSubmit={handleSubmit}>

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

              <button
                type="button"
                className="forgot-password"
                onClick={() => alert("Password reset will be added later.")}
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className="login-submit">
              Sign In
            </button>

          </form>

          {/* Register Link */}
          <p className="auth-footer-text">
            Don't have an account?{" "}
            <Link to="/register">Create an account</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;