import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import { seekerSidebarItems, employerSidebarItems, adminSidebarItems } from "./config/sidebarConfig";
import NotFoundPage from "./pages/NotFoundPage";


import CompaniesListPage from "./pages/public/CompaniesListPage";
import HomePage from "./pages/public/HomePage";
import JobDetailPage from "./pages/public/JobDetailPage";
import CompanyProfilePage from "./pages/public/CompanyProfilePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import SeekerDashboard from "./pages/seeker/SeekerDashboard";
import MyApplicationsPage from "./pages/seeker/MyApplicationsPage";
import SavedJobsPage from "./pages/seeker/SavedJobsPage";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import PostJobPage from "./pages/employer/PostJobPage";
import ManageListingsPage from "./pages/employer/ManageListingsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/jobs/:id", element: <JobDetailPage /> },
      { path: "/companies/:id", element: <CompanyProfilePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/companies", element: <CompaniesListPage /> },
    ],
  },
  {
    element: <DashboardLayout items={seekerSidebarItems} title="Candidat" />,
    children: [
      { path: "/dashboard/seeker", element: <SeekerDashboard /> },
      { path: "/dashboard/seeker/applications", element: <MyApplicationsPage /> },
      { path: "/dashboard/seeker/saved", element: <SavedJobsPage /> },
    ],
  },
  {
    element: <DashboardLayout items={employerSidebarItems} title="Employeur" />,
    children: [
      { path: "/dashboard/employer", element: <EmployerDashboard /> },
      { path: "/dashboard/employer/post", element: <PostJobPage /> },
      { path: "/dashboard/employer/listings", element: <ManageListingsPage /> },
    ],
  },
  {
    element: <DashboardLayout items={adminSidebarItems} title="Admin" />,
    children: [{ path: "/dashboard/admin", element: <AdminDashboard /> }],
  },
  {
    element: <PublicLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/companies", element: <CompaniesListPage /> },
      { path: "/jobs/:id", element: <JobDetailPage /> },
      { path: "/companies/:id", element: <CompanyProfilePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
]);