import { Navigate } from "react-router-dom";

const isAdminToken = (token) => {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded.role === "admin";
  } catch {
    return false;
  }
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token || !isAdminToken(token)) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;
