import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Today from "./pages/Today";
import Week from "./pages/Week";
import Profile from "./pages/Profile";
import EditPhone from "./pages/EditPhone";
import EditClass from "./pages/EditClass";
import UpdatePhoto from "./pages/UpdatePhoto";
import SetupEmail from "./pages/SetupEmail";
import NotFound from "./pages/NotFound";
import FindRoom from "./pages/FindRoom";
import Notifications from "./pages/Notifications";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminManager from "./pages/admin/AdminManager";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/:resource"
          element={
            <AdminRoute>
              <AdminManager />
            </AdminRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/today"
          element={
            <ProtectedRoute>
              <Today />
            </ProtectedRoute>
          }
        />

        <Route
          path="/week"
          element={
            <ProtectedRoute>
              <Week />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditPhone />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/edit/class"
          element={
            <ProtectedRoute>
              <EditClass />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/photo"
          element={
            <ProtectedRoute>
              <UpdatePhoto />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/email"
          element={
            <ProtectedRoute>
              <SetupEmail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/find-room"
          element={
            <ProtectedRoute>
              <FindRoom />
            </ProtectedRoute>
          }
       />
       
       <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
       />
       
       <Route
          path="/settings"
         element={<Settings />}
       />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
