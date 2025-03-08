import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// Theme
import theme from "./theme";

// Context
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layout
import AppLayout from "./components/layout/AppLayout";

// Pages
import HomePage from "./pages/HomePage";
import CreatorDashboard from "./pages/creator/CreatorDashboard";
import CollaborationsPage from "./pages/creator/CollaborationsPage";
import CalendarPage from "./pages/creator/CalendarPage";
import InsightsPage from "./pages/creator/InsightsPage";
import TaskManagementPage from "./pages/creator/TaskManagementPage";
import CreatorProfilePage from "./pages/CreatorProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

// Brand Pages
import BrandDashboard from "./pages/brand/BrandDashboard";
import BrandCollaborationsPage from "./pages/brand/BrandCollaborationsPage";
import BrandCreatorsPage from "./pages/brand/BrandCreatorsPage";
import BrandInquiryPage from "./pages/brand/BrandInquiryPage";

// Protected Route Component
const ProtectedRoute: React.FC<{
  element: React.ReactNode;
  allowedUserTypes?: ("creator" | "brand")[];
}> = ({ element, allowedUserTypes }) => {
  const { isAuthenticated, userType } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedUserTypes &&
    userType &&
    !allowedUserTypes.includes(userType as "creator" | "brand")
  ) {
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
};

// App Routes
const AppRoutes: React.FC = () => {
  const { isAuthenticated, userType } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Creator Routes */}
      <Route
        path="/creator/dashboard"
        element={
          <ProtectedRoute
            element={
              <AppLayout>
                <CreatorDashboard />
              </AppLayout>
            }
            allowedUserTypes={["creator"]}
          />
        }
      />
      <Route
        path="/creator/collaborations"
        element={
          <ProtectedRoute
            element={
              <AppLayout>
                <CollaborationsPage />
              </AppLayout>
            }
            allowedUserTypes={["creator"]}
          />
        }
      />
      <Route
        path="/creator/calendar"
        element={
          <ProtectedRoute
            element={
              <AppLayout>
                <CalendarPage />
              </AppLayout>
            }
            allowedUserTypes={["creator"]}
          />
        }
      />
      <Route
        path="/creator/insights"
        element={
          <ProtectedRoute
            element={
              <AppLayout>
                <InsightsPage />
              </AppLayout>
            }
            allowedUserTypes={["creator"]}
          />
        }
      />
      <Route
        path="/creator/task-management"
        element={
          <ProtectedRoute
            element={
              <AppLayout>
                <TaskManagementPage />
              </AppLayout>
            }
            allowedUserTypes={["creator"]}
          />
        }
      />
      <Route
        path="/creator/profile"
        element={
          <ProtectedRoute
            element={
              <AppLayout>
                <CreatorProfilePage />
              </AppLayout>
            }
            allowedUserTypes={["creator"]}
          />
        }
      />

      {/* Brand Routes */}
      <Route
        path="/brand/dashboard"
        element={
          <ProtectedRoute
            element={
              <AppLayout>
                <BrandDashboard />
              </AppLayout>
            }
            allowedUserTypes={["brand"]}
          />
        }
      />
      <Route
        path="/brand/creators"
        element={
          <ProtectedRoute
            element={
              <AppLayout>
                <BrandCreatorsPage />
              </AppLayout>
            }
            allowedUserTypes={["brand"]}
          />
        }
      />
      <Route
        path="/brand/collaborations"
        element={
          <ProtectedRoute
            element={
              <AppLayout>
                <BrandCollaborationsPage />
              </AppLayout>
            }
            allowedUserTypes={["brand"]}
          />
        }
      />
      <Route
        path="/brand/inquiry"
        element={
          <ProtectedRoute
            element={
              <AppLayout>
                <BrandInquiryPage />
              </AppLayout>
            }
            allowedUserTypes={["brand"]}
          />
        }
      />

      {/* Redirect based on user type */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <Navigate
              to={
                userType === "creator"
                  ? "/creator/dashboard"
                  : "/brand/dashboard"
              }
              replace
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Router>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
