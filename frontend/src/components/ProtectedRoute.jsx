import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  if (allowedRole) {
    const user = JSON.parse(atob(token.split(".")[1]));

    if (user.role !== allowedRole) {
      return <Navigate to="/dashboard" />;
    }
  }

  return children;
}