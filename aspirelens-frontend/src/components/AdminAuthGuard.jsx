import { Navigate } from "react-router-dom";

const AdminAuthGuard = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminAuthGuard;
