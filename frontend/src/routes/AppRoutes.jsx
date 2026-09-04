import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public pages
import Home from "../public/pages/Home";
import About from "../public/pages/About";
import HowItWorks from "../public/pages/HowItWorks";

// Authentication pages
import Login from "../auth/pages/Login";
import Register from "../auth/pages/Register";

// Citizen pages
import CitizenHome from "../citizen/pages/Home";
import SubmitProblem from "../citizen/pages/SubmitProblem";
import MyProblems from "../citizen/pages/MyProblems";
import CitizenNotifications from "../citizen/pages/Notifications";
import CitizenSettings from "../citizen/pages/Settings";

// University pages
import UniversityHome from "../university/pages/Home";
import UniversityProblems from "../university/pages/Problems";
import UniversitySolutions from "../university/pages/Solutions";
import UniversityMeetings from "../university/pages/Meetings";
import UniversityNotifications from "../university/pages/Notifications";
import UniversitySettings from "../university/pages/Settings";

// Government pages
import GovernmentHome from "../government/pages/Home";
import GovernmentSolutions from "../government/pages/Solutions";
import GovernmentReview from "../government/pages/Review";
import GovernmentCompanies from "../government/pages/Companies";
import GovernmentMeetings from "../government/pages/Meetings";
import GovernmentNotifications from "../government/pages/Notifications";
import GovernmentSettings from "../government/pages/Settings";

// Company pages
import CompanyHome from "../company/pages/Home";
import CompanyOpportunities from "../company/pages/Opportunities";
import CompanySolutions from "../company/pages/Solutions";
import CompanyMeetings from "../company/pages/Meetings";
import CompanyNotifications from "../company/pages/Notifications";
import CompanySettings from "../company/pages/Settings";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Citizen */}
        <Route path="/citizen" element={<CitizenHome />} />
        <Route path="/citizen/submit" element={<SubmitProblem />} />
        <Route path="/citizen/myproblems" element={<MyProblems />} />
        <Route
          path="/citizen/notifications"
          element={<CitizenNotifications />}
        />
        <Route path="/citizen/settings" element={<CitizenSettings />} />

        {/* University */}
        <Route path="/university" element={<UniversityHome />} />
        <Route
          path="/university/problems"
          element={<UniversityProblems />}
        />
        <Route
          path="/university/solutions"
          element={<UniversitySolutions />}
        />
        <Route
          path="/university/meetings"
          element={<UniversityMeetings />}
        />
        <Route
          path="/university/notifications"
          element={<UniversityNotifications />}
        />
        <Route
          path="/university/settings"
          element={<UniversitySettings />}
        />

        {/* Government */}
        <Route path="/government" element={<GovernmentHome />} />
        <Route
          path="/government/solutions"
          element={<GovernmentSolutions />}
        />
        <Route
          path="/government/review"
          element={<GovernmentReview />}
        />
        <Route
          path="/government/companies"
          element={<GovernmentCompanies />}
        />
        <Route
          path="/government/meetings"
          element={<GovernmentMeetings />}
        />
        <Route
          path="/government/notifications"
          element={<GovernmentNotifications />}
        />
        <Route
          path="/government/settings"
          element={<GovernmentSettings />}
        />

        {/* Company */}
        <Route path="/company" element={<CompanyHome />} />
        <Route
          path="/company/opportunities"
          element={<CompanyOpportunities />}
        />
        <Route
          path="/company/solutions"
          element={<CompanySolutions />}
        />
        <Route
          path="/company/meetings"
          element={<CompanyMeetings />}
        />
        <Route
          path="/company/notifications"
          element={<CompanyNotifications />}
        />
        <Route
          path="/company/settings"
          element={<CompanySettings />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;