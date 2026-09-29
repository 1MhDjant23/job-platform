import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { JobListingPage } from "./pages/jobs/JobListingPage";
import JobDetailPage from "./pages/jobs/JobDetailPage";
import { SetupCompanyPage } from "./pages/dashboard/SetupCompanyPage";
import { EmployerDashboard } from "./pages/dashboard/EmployerDashboard";
import PostJobPage from "./pages/dashboard/PostJobPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/jobs" element={<JobListingPage />} />
      <Route path="/jobs/:id" element={<JobDetailPage />} />

      <Route element={<ProtectedRoute allowedRoles={["EMPLOYER"]} />}>
        <Route path="/setup-company" element={<SetupCompanyPage />} />
        <Route path="/dashboard" element={<EmployerDashboard />} />
        <Route path="/post-job" element={<PostJobPage />} />

        <Route path="/" element={<p>Home Page</p>}/>
      </Route>
    </Routes>
  );
}

export default App
