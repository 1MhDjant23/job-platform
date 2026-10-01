import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { JobListingPage } from "./pages/jobs/JobListingPage";
import JobDetailPage from "./pages/jobs/JobDetailPage";
import { SetupCompanyPage } from "./pages/dashboard/SetupCompanyPage";
import { EmployerDashboard } from "./pages/dashboard/EmployerDashboard";
import PostJobPage from "./pages/dashboard/PostJobPage";
import MyApplicationsPage from "./pages/jobs/MyApplicationsPage";
import { Navbar } from "./components/layout/Navbar";

function App() {
  return (
    <Routes>
      {/* auth pages , no navbar */}
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/register" element={<RegisterPage />} />

      {/* All other pages with navabr  */}
      <Route element={<Navbar />}>

      {/* public  */}
      <Route path="/jobs" element={<JobListingPage />} />
      <Route path="/jobs/:id" element={<JobDetailPage />} />

      {/* Any logged in user  */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<JobListingPage />} />
      </Route>

      {/* Employer only  */}
      <Route element={<ProtectedRoute allowedRoles={["EMPLOYER"]} />}>
        <Route path="/setup-company" element={<SetupCompanyPage />} />
        <Route path="/dashboard" element={<EmployerDashboard />} />
        <Route path="/post-job" element={<PostJobPage />} />
      </Route>

      {/* Job seeker only  */}
      <Route element={<ProtectedRoute allowedRoles={["JOB_SEEKER"]} />}>
        <Route path="/applications" element={<MyApplicationsPage />} />
      </Route>

      {/* 404 */}

      <Route
        path="*"
        element={
          <div className="flex flex-col items-center justify-center
                            min-h-[60vh] text-center px-4">
            <p className="text-6xl mb-4">404</p>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Page not found
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              The page you're looking for doesn't exist
            </p>
            <a href="/jobs" className="px-4 py-2 bg-blue-600 text-white text-sm
                           rounded-lg hover:bg-blue-700 transition-colors">
              Browse jobs
            </a>
          </div>
        }
      />
      </Route>
    </Routes>
  );
}

export default App
