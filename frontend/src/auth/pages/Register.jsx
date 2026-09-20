import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./Register.css";

function Register() {
  const [role, setRole] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState(false);

const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    setSuccess(false);

    if (!role) {
      setError("Please select your role.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

if (!passwordPattern.test(formData.password)) {
  setError(
    "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
  );
  return;
}
    try {
      setLoading(true);

      const { data, error: signUpError } =
        await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              role: role,
            },
          },
        });

      if (signUpError) {
        throw signUpError;
      }

      if (data.user) {
        setSuccess(
          "Account created successfully. Please check your email to verify your account."
        );
      }

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setRole("");
    } catch (err) {
      console.error(err);

      if (
        err.message?.toLowerCase().includes("already registered")
      ) {
        setError(
          "An account with this email already exists."
        );
      } else {
        setError(
          err.message || "Unable to create your account."
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
            <span>JOIN CIVIORA</span>

            <h1>Create your account</h1>

            <p>
              Choose your role to join the civic innovation network.
            </p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success">
              {success}
            </div>
          )}

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >

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

  <div className="password-input-wrapper">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="Create a password"
      value={formData.password}
      onChange={handleChange}
      minLength="8"
      required
    />

    <button
      type="button"
      className="password-toggle"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? "Hide" : "Show"}
    </button>
  </div>

  <p className="password-hint">
    Use 8+ characters with uppercase, lowercase, number and special character.
  </p>
</div>

                 <div className="form-group">
  <label>Confirm Password</label>

  <div className="password-input-wrapper">
    <input
      type={showConfirmPassword ? "text" : "password"}
      name="confirmPassword"
      placeholder="Confirm your password"
      value={formData.confirmPassword}
      onChange={handleChange}
      minLength="8"
      required
    />

    <button
      type="button"
      className="password-toggle"
      onClick={() =>
        setShowConfirmPassword(!showConfirmPassword)
      }
    >
      {showConfirmPassword ? "Hide" : "Show"}
    </button>
  </div>
</div>

            <div className="form-group">
              <label>Select Your Role</label>

              <div className="role-options">

                <button
                  type="button"
                  className={
                    role === "citizen"
                      ? "role-option selected"
                      : "role-option"
                  }
                  onClick={() => setRole("citizen")}
                >
                  Citizen
                </button>

                <button
                  type="button"
                  className={
                    role === "university"
                      ? "role-option selected"
                      : "role-option"
                  }
                  onClick={() => setRole("university")}
                >
                  University
                </button>

                <button
                  type="button"
                  className={
                    role === "government"
                      ? "role-option selected"
                      : "role-option"
                  }
                  onClick={() => setRole("government")}
                >
                  Government
                </button>

                <button
                  type="button"
                  className={
                    role === "company"
                      ? "role-option selected"
                      : "role-option"
                  }
                  onClick={() => setRole("company")}
                >
                  Company
                </button>

              </div>
            </div>

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

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