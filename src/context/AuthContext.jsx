import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../services/authService";
import { AuthContext } from "./authContext";
import { getCurrentUserApi } from "../services/userService";

const getFullName = (u) => {
  if (!u) return "";
  if (u.fullName) return u.fullName;
  const firstName = u.firstName || "";
  const lastName = u.lastName || "";
  return `${firstName} ${lastName}`.trim() || u.username || u.email || "";
};

// 5 hours in milliseconds
const TOKEN_EXPIRATION_TIME = 5 * 60 * 60 * 1000;

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

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      refreshUser();
    }
  }, []);

  // 5 tiếng bị out token
  useEffect(() => {
    const tokenTimestamp = localStorage.getItem("tokenTimestamp");
    if (!tokenTimestamp) return;
    const checkTokenExpiration = () => {
      const currentTime = Date.now();
      const loginTime = parseInt(tokenTimestamp, 10);
      const timeElapsed = currentTime - loginTime;

      if (timeElapsed >= TOKEN_EXPIRATION_TIME) {
        logout();
        navigate("/customer", { replace: true });
      }
    };
    checkTokenExpiration();
    const expirationInterval = setInterval(checkTokenExpiration, 60 * 1000);
    return () => clearInterval(expirationInterval);
  }, [navigate]);

  const login = async (credentials) => {
    const res = await loginApi(credentials);
    const loginUser = res.data.data;

    localStorage.setItem("accessToken", loginUser.token);
    localStorage.setItem("role", loginUser.role);
    localStorage.setItem("tokenTimestamp", Date.now().toString());
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
