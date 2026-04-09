import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    if (role === "CUSTOMER") {
      return <Navigate to="/customer" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
