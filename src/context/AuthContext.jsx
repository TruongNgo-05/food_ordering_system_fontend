import React, { useState } from "react";
import { loginApi } from "../services/authService";
import { AuthContext } from "./authContext";

const getFullName = (u) => {
  if (!u) return "";
  if (u.fullName) return u.fullName;
  const firstName = u.firstName || "";
  const lastName = u.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || u.username || u.email || "";
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("accessToken"),
  );
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [userFullName, setUserFullName] = useState(
    () => localStorage.getItem("userFullName") || "",
  );

  const login = async (credentials) => {
    const res = await loginApi(credentials);
    const loginUser = res.data.data;

    // Lưu dữ liệu login
    localStorage.setItem("accessToken", loginUser.token);
    localStorage.setItem("role", loginUser.role);
    localStorage.setItem("user", JSON.stringify(loginUser));
    localStorage.setItem("userInfo", JSON.stringify(loginUser));
    const fullName = getFullName(loginUser);
    localStorage.setItem("userFullName", fullName);

    setIsLoggedIn(true);
    setRole(loginUser.role);
    setUser(loginUser);
    setUserFullName(fullName);

    return loginUser;
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRole(null);
    setUser(null);
    setUserFullName("");
  };

  const refreshUser = async () => {
    const stored = localStorage.getItem("user");
    const parsed = stored ? JSON.parse(stored) : null;
    setUser(parsed);
    const fullName = getFullName(parsed);
    setUserFullName(fullName);
    localStorage.setItem("userFullName", fullName);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, role, user, userFullName, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
