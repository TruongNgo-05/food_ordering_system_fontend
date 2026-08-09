import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";

const HomeRedirect = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  // Chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ADMIN
  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  // STAFF
  if (user?.role === "STAFF") {
    return <Navigate to="/staff" replace />;
  }

  // CUSTOMER
  return <Navigate to="/home" replace />;
};

export default HomeRedirect;
