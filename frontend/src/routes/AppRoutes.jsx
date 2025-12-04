import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

// Pages
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreateTemplate from "../pages/CreateTemplate";
import EditTemplate from "../pages/EditTemplate";
import ViewTemplate from "../pages/ViewTemplate";
import ProfileManagement from "../pages/ProfileManagement";
import Settings from "../pages/Settings";
import LandingPage from "../pages/LandingPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          // <PrivateRoute>
          <Dashboard />
          // </PrivateRoute>
        }
      />
      <Route
        path="/templates/create"
        element={
          <PrivateRoute>
            <CreateTemplate />
          </PrivateRoute>
        }
      />
      <Route
        path="/templates/edit/:id"
        element={
          <PrivateRoute>
            <EditTemplate />
          </PrivateRoute>
        }
      />
      <Route
        path="/templates/view/:id"
        element={
          <PrivateRoute>
            <ViewTemplate />
          </PrivateRoute>
        }
      />
      <Route
        path="/profiles"
        element={
          <PrivateRoute>
            <ProfileManagement />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 - Redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
