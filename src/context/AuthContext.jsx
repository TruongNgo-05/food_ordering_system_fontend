import React, { useState, useEffect } from "react";
import { loginApi } from "../services/authService";
import { AuthContext } from "./authContext";
import { getCurrentUserApi } from "../services/userService"; // ✅ thêm import

const getFullName = (u) => {
  if (!u) return "";
  if (u.fullName) return u.fullName;
  const firstName = u.firstName || "";
  const lastName = u.lastName || "";
  return `${firstName} ${lastName}`.trim() || u.username || u.email || "";
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

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      refreshUser();
    }
  }, []);

  const login = async (credentials) => {
    const res = await loginApi(credentials);
    const loginUser = res.data.data;

    localStorage.setItem("accessToken", loginUser.token);
    localStorage.setItem("role", loginUser.role);
    setIsLoggedIn(true);
    setRole(loginUser.role);
    await refreshUser();

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
    try {
      const res = await getCurrentUserApi();
      const apiUser = res.data?.data;
      if (apiUser) {
        const fullName = getFullName(apiUser);
        localStorage.setItem("user", JSON.stringify(apiUser));
        localStorage.setItem("userFullName", fullName);
        setUser(apiUser);
        setUserFullName(fullName);
      }
    } catch (err) {
      console.error("Lỗi fetch /users/me:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        role,
        user,
        userFullName,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
