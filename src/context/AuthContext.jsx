import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./authContext";

import { loginApi, logoutApi } from "../services/authService";
import { getCurrentUserApi } from "../services/userService";

const getFullName = (u) => {
  if (!u) return "";
  if (u.fullName) return u.fullName;

  const firstName = u.firstName || "";
  const lastName = u.lastName || "";

  return `${firstName} ${lastName}`.trim() || u.username || u.email || "";
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

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

  const [authLoading, setAuthLoading] = useState(true);

  // ============================
  // INIT WHEN RELOAD PAGE
  // ============================
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setAuthLoading(false);
        return;
      }

      await refreshUser();
      setIsLoggedIn(true);

      setAuthLoading(false);
    };

    init();
  }, []);

  // ============================
  // LOGIN NORMAL
  // ============================
  const login = async (credentials) => {
    const res = await loginApi(credentials);
    const loginUser = res.data.data;

    localStorage.setItem("accessToken", loginUser.accessToken);
    localStorage.setItem("role", loginUser.role);

    setIsLoggedIn(true);
    setRole(loginUser.role);

    await refreshUser();

    return loginUser;
  };

  // ============================
  // LOGIN GOOGLE / OAUTH
  // ============================
  const loginGoogle = async (accessToken) => {
    localStorage.setItem("accessToken", accessToken);

    setIsLoggedIn(true);

    const apiUser = await refreshUser();

    setRole(apiUser?.role || null);

    return apiUser;
  };

  // ============================
  // LOGOUT
  // ============================
  const logout = async () => {
    try {
      await logoutApi();
    } catch (e) {}

    localStorage.clear();

    setIsLoggedIn(false);
    setRole(null);
    setUser(null);
    setUserFullName("");

    navigate("/login");
  };

  // ============================
  // REFRESH USER
  // ============================
  const refreshUser = async () => {
    try {
      const res = await getCurrentUserApi();
      const apiUser = res.data.data;

      if (!apiUser) return null;

      const fullName = getFullName(apiUser);

      setUser(apiUser);
      setRole(apiUser.role);
      setUserFullName(fullName);

      localStorage.setItem("user", JSON.stringify(apiUser));
      localStorage.setItem("role", apiUser.role);
      localStorage.setItem("userFullName", fullName);

      return apiUser;
    } catch (err) {
      console.error("refreshUser error:", err);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        role,
        user,
        userFullName,
        authLoading,
        login,
        loginGoogle,
        logout,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
