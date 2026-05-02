import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./lib/AuthContext";
import { useAuth } from "./lib/useAuth";

// Pages
import { DashboardView }     from "../pages/Dashboard";
import { TransactionsView }  from "../pages/Transactions";
import { BudgetsView }       from "../pages/Budgets";
import { AnalyticsView }     from "../pages/Analytics";
import { RecurringView }     from "../pages/Recurring";
import { ReportsView }       from "../pages/Reports";
import { NotificationsView } from "../pages/Notifications";
import { SecurityView }      from "../pages/Security";
import { SettingsView }      from "../pages/Settings";
import { SupportView }       from "../pages/Support";
import { LoginView }         from "../pages/Auth";

// If already authenticated, redirect away from login page
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return user ? <Navigate to="/" replace /> : <>{children}</>;
};


function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginView /></PublicRoute>} />

      {/* All app routes are protected */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/"              element={<DashboardView />} />
          <Route path="/transactions"  element={<TransactionsView />} />
          <Route path="/budgets"       element={<BudgetsView />} />
          <Route path="/analytics"     element={<AnalyticsView />} />
          <Route path="/recurring"     element={<RecurringView />} />
          <Route path="/reports"       element={<ReportsView />} />
          <Route path="/notifications" element={<NotificationsView />} />
          <Route path="/security"      element={<SecurityView />} />
          <Route path="/settings"      element={<SettingsView />} />
          <Route path="/support"       element={<SupportView />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <PWAInstallPrompt />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
