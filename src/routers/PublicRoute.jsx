import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
const PublicRoute = ({ children }) => {
  const { isLoggedIn, role } = useAuth();
  if (isLoggedIn) {
    if (role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    if (role === "CUSTOMER") {
      return <Navigate to="/customer" replace />;
    }
  }
  return children;
};
export default PublicRoute;