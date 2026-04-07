import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const PublicRoute = ({ children }) => {
  const { isLoggedIn, role } = useAuth();
  if (isLoggedIn) {
    if (role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    if (role === "USER") {
      return <Navigate to="/user" replace />;
    }
  }
  return children;
};
export default PublicRoute;