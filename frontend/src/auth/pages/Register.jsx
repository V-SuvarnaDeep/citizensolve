import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select your role.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    console.log("Registration data:", {
      ...formData,
      role,
    });
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
            <span>JOIN CIVIORA</span>

            <h1>Create your account</h1>

            <p>
              Choose your role to join the civic innovation network.
            </p>
          </div>

          {/* Registration Form */}
          <form className="register-form" onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* Role Selection */}
            <div className="form-group">
              <label>Select Your Role</label>

              <div className="role-options">

                <button
                  type="button"
                  className={role === "citizen" ? "role-option selected" : "role-option"}
                  onClick={() => setRole("citizen")}
                >
                  Citizen
                </button>

                <button
                  type="button"
                  className={role === "university" ? "role-option selected" : "role-option"}
                  onClick={() => setRole("university")}
                >
                  University
                </button>

                <button
                  type="button"
                  className={role === "government" ? "role-option selected" : "role-option"}
                  onClick={() => setRole("government")}
                >
                  Government
                </button>

                <button
                  type="button"
                  className={role === "company" ? "role-option selected" : "role-option"}
                  onClick={() => setRole("company")}
                >
                  Company
                </button>

              </div>
            </div>

            <button type="submit" className="register-submit">
              Create Account
            </button>

          </form>

          {/* Login Link */}
          <p className="auth-footer-text">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;