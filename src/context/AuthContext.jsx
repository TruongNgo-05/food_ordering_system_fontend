import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { AuthContext } from "./authContext";

import { loginApi, logoutApi } from "../services/authService";

import { getCurrentUserApi } from "../services/userService";

// ======================================================
// GET FULL NAME
// ======================================================

const getFullName = (u) => {
  if (!u) return "";

  if (u.fullName) {
    return u.fullName;
  }

  const firstName = u.firstName || "";
  const lastName = u.lastName || "";

  return `${firstName} ${lastName}`.trim() || u.username || u.email || "";
};

// ======================================================
// AUTH PROVIDER
// ======================================================

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // ====================================================
  // STATE
  // ====================================================

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("accessToken"),
  );

  const [role, setRole] = useState(() => localStorage.getItem("role"));

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");

    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [userFullName, setUserFullName] = useState(
    () => localStorage.getItem("userFullName") || "",
  );

  const [authLoading, setAuthLoading] = useState(true);

  // ====================================================
  // INIT AUTH
  // ====================================================

  useEffect(() => {
    const init = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        // Không có Access Token
        if (!accessToken) {
          setIsLoggedIn(false);

          return;
        }

        // ==================================================
        // Gọi API lấy user
        //
        // Access Token còn hạn
        //      → 200
        //
        // Access Token hết hạn
        //      → 401
        //      → Axios interceptor tự refresh
        //      → retry request
        // ==================================================

        const apiUser = await refreshUser();

        if (apiUser) {
          setIsLoggedIn(true);
        } else {
          handleLocalLogout();
        }
      } catch (error) {
        console.error("Auth init error:", error);

        handleLocalLogout();
      } finally {
        setAuthLoading(false);
      }
    };

    init();
  }, []);

  // ====================================================
  // LOGIN
  // ====================================================

  const login = async (credentials) => {
    const res = await loginApi(credentials);

    const loginUser = res.data.data;

    // ==================================================
    // LƯU ACCESS TOKEN
    // ==================================================

    localStorage.setItem("accessToken", loginUser.accessToken);

    localStorage.setItem("role", loginUser.role);

    setIsLoggedIn(true);

    setRole(loginUser.role);

    // ==================================================
    // LẤY USER
    // ==================================================

    await refreshUser();

    return loginUser;
  };

  // ====================================================
  // LOGIN GOOGLE
  // ====================================================

  const loginGoogle = async (accessToken) => {
    localStorage.setItem("accessToken", accessToken);

    setIsLoggedIn(true);

    const apiUser = await refreshUser();

    if (apiUser) {
      setRole(apiUser.role);
    }

    return apiUser;
  };

  // ====================================================
  // LOCAL LOGOUT
  // ====================================================

  const handleLocalLogout = () => {
    localStorage.removeItem("accessToken");

    localStorage.removeItem("role");

    localStorage.removeItem("user");

    localStorage.removeItem("userFullName");

    setIsLoggedIn(false);

    setRole(null);

    setUser(null);

    setUserFullName("");
  };

  // ====================================================
  // LOGOUT
  // ====================================================

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Logout error:", error);
    }

    handleLocalLogout();

    navigate("/login");
  };

  // ====================================================
  // REFRESH USER
  // ====================================================

  const refreshUser = async () => {
    try {
      const res = await getCurrentUserApi();

      const apiUser = res.data.data;

      if (!apiUser) {
        return null;
      }

      const fullName = getFullName(apiUser);

      // ==================================================
      // STATE
      // ==================================================

      setUser(apiUser);

      setRole(apiUser.role);

      setUserFullName(fullName);

      // ==================================================
      // LOCAL STORAGE
      // ==================================================

      localStorage.setItem("user", JSON.stringify(apiUser));

      localStorage.setItem("role", apiUser.role);

      localStorage.setItem("userFullName", fullName);

      return apiUser;
    } catch (error) {
      console.error("refreshUser error:", error);

      return null;
    }
  };

  // ====================================================
  // CONTEXT
  // ====================================================

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
