import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./Register.css";

function Register() {
  

  const [role, setRole] = useState("citizen");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",

    organizationName: "",
    location: "",

    departments: "",
    expertise: "",
    technologies: "",
    capabilities: "",
    industries: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const convertToArray = (value) => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (
      (role === "university" || role === "company") &&
      !formData.organizationName.trim()
    ) {
      setError("Please enter the organization name.");
      return;
    }

    if (
      (role === "university" || role === "company") &&
      !formData.location.trim()
    ) {
      setError("Please enter the organization location.");
      return;
    }

    try {
      setLoading(true);

      let organizationDetails = null;

      if (role === "university") {
        organizationDetails = {
          organization_name:
            formData.organizationName.trim(),

          location:
            formData.location.trim(),

          departments:
            convertToArray(formData.departments),

          expertise:
            convertToArray(formData.expertise),

          technologies:
            convertToArray(formData.technologies),

          capabilities:
            convertToArray(formData.capabilities),
        };
      }

      if (role === "company") {
        organizationDetails = {
          organization_name:
            formData.organizationName.trim(),

          location:
            formData.location.trim(),

          industries:
            convertToArray(formData.industries),

          expertise:
            convertToArray(formData.expertise),

          technologies:
            convertToArray(formData.technologies),

          capabilities:
            convertToArray(formData.capabilities),
        };
      }

      const { error: signUpError } =
        await supabase.auth.signUp({
          email: formData.email.trim(),
          password: formData.password,

          options: {
            data: {
              name: formData.name.trim(),
              role: role,
              organization_details:
                organizationDetails,
            },
          },
        });

      if (signUpError) {
        throw signUpError;
      }

      setMessage(
        "Registration successful. Please check your email if verification is required."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        organizationName: "",
        location: "",
        departments: "",
        expertise: "",
        technologies: "",
        capabilities: "",
        industries: "",
      });

    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-brand">
        <Link to="/">
          CIVIORA
        </Link>
      </div>

      <div className="auth-container">

        <div className="auth-card">

          <div className="auth-header">

            <span>
              CIVIORA PLATFORM
            </span>

            <h1>
              Create your account
            </h1>

            <p>
              Join the civic innovation ecosystem and
              participate in solving real-world problems.
            </p>

          </div>

          <form
            className="auth-form"
            onSubmit={handleRegister}
          >

            {/* ROLE */}

            <div className="role-selector">

              <label>
                Account Type
              </label>

              <div className="role-options">

                <button
                  type="button"
                  className={
                    role === "citizen"
                      ? "role-option active"
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
                      ? "role-option active"
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
                      ? "role-option active"
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
                      ? "role-option active"
                      : "role-option"
                  }
                  onClick={() => setRole("company")}
                >
                  Company
                </button>

              </div>

            </div>

            {/* BASIC INFORMATION */}

            <div className="input-group">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

            </div>

            <div className="input-group">

              <label>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />

            </div>

            <div className="input-group">

              <label>
                Password
              </label>

              <div className="password-wrapper">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>

            <div className="input-group">

              <label>
                Confirm Password
              </label>

              <div className="password-wrapper">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>

            {/* UNIVERSITY */}

            {role === "university" && (
              <div className="organization-section">

                <div className="organization-header">

                  <span>
                    UNIVERSITY DETAILS
                  </span>

                  <h2>
                    Tell us about your university
                  </h2>

                  <p>
                    These details help Civiora match
                    civic problems with suitable
                    universities.
                  </p>

                </div>

                <div className="input-group">

                  <label>
                    University Name
                  </label>

                  <input
                    type="text"
                    name="organizationName"
                    value={
                      formData.organizationName
                    }
                    onChange={handleChange}
                    placeholder="e.g. ANITS"
                    required
                  />

                </div>

                <div className="input-group">

                  <label>
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Visakhapatnam, Andhra Pradesh"
                    required
                  />

                </div>

                <div className="input-group">

                  <label>
                    Departments
                  </label>

                  <input
                    type="text"
                    name="departments"
                    value={formData.departments}
                    onChange={handleChange}
                    placeholder="Computer Science, Civil Engineering, ECE"
                  />

                  <small>
                    Separate multiple departments with commas.
                  </small>

                </div>

                <div className="input-group">

                  <label>
                    Expertise
                  </label>

                  <input
                    type="text"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleChange}
                    placeholder="Artificial Intelligence, IoT, Cybersecurity"
                  />

                  <small>
                    Add the university's major areas of expertise.
                  </small>

                </div>

                <div className="input-group">

                  <label>
                    Technologies
                  </label>

                  <input
                    type="text"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleChange}
                    placeholder="Python, React, IoT, GIS"
                  />

                </div>

                <div className="input-group">

                  <label>
                    Capabilities
                  </label>

                  <input
                    type="text"
                    name="capabilities"
                    value={formData.capabilities}
                    onChange={handleChange}
                    placeholder="AI Solutions, Research, Web Development"
                  />

                </div>

              </div>
            )}

            {/* COMPANY */}

            {role === "company" && (
              <div className="organization-section">

                <div className="organization-header">

                  <span>
                    COMPANY DETAILS
                  </span>

                  <h2>
                    Tell us about your company
                  </h2>

                  <p>
                    These details help Civiora identify
                    suitable companies for approved
                    university solutions.
                  </p>

                </div>

                <div className="input-group">

                  <label>
                    Company Name
                  </label>

                  <input
                    type="text"
                    name="organizationName"
                    value={
                      formData.organizationName
                    }
                    onChange={handleChange}
                    placeholder="Enter company name"
                    required
                  />

                </div>

                <div className="input-group">

                  <label>
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Visakhapatnam, Andhra Pradesh"
                    required
                  />

                </div>

                <div className="input-group">

                  <label>
                    Industries
                  </label>

                  <input
                    type="text"
                    name="industries"
                    value={formData.industries}
                    onChange={handleChange}
                    placeholder="Infrastructure, Construction, Smart Cities"
                  />

                  <small>
                    Separate multiple industries with commas.
                  </small>

                </div>

                <div className="input-group">

                  <label>
                    Expertise
                  </label>

                  <input
                    type="text"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleChange}
                    placeholder="Civil Engineering, Infrastructure Development"
                  />

                </div>

                <div className="input-group">

                  <label>
                    Technologies
                  </label>

                  <input
                    type="text"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleChange}
                    placeholder="IoT, GIS, GPS, Cloud Computing"
                  />

                </div>

                <div className="input-group">

                  <label>
                    Capabilities
                  </label>

                  <input
                    type="text"
                    name="capabilities"
                    value={formData.capabilities}
                    onChange={handleChange}
                    placeholder="Infrastructure Development, Smart City Solutions"
                  />

                </div>

              </div>
            )}

            {/* MESSAGES */}

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

            {/* SUBMIT */}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

            <p className="auth-footer-text">

              Already have an account?{" "}

              <Link to="/login">
                Sign in
              </Link>

            </p>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Register;