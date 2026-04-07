// // Quản lý trạng thái đăng nhập (login/logout) và role của người dùng
// // cho toàn bộ ứng dụng React thông qua Context API.
// /* eslint-disable react-refresh/only-export-components */
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { loginApi } from "../services/authService";
// import { getCurrentUserApi } from "../services/userService";
// export const AuthContext = createContext();
// export const useAuth = () => useContext(AuthContext);
// export const AuthProvider = ({ children }) => {

//   const [isLoggedIn, setIsLoggedIn] = useState(
//     () => !!localStorage.getItem("accessToken")
//   );

//   const [role, setRole] = useState(
//     () => localStorage.getItem("role")
//   );

//   const [user, setUser] = useState(() => {
//     const stored = localStorage.getItem("user");
//     return stored ? JSON.parse(stored) : null;
//   });

//   const [userFullName, setUserFullName] = useState(
//     () => localStorage.getItem("userFullName") || ""
//   );

// /**
//  * Logs in the user by calling login API with credentials.
//  * Saves token, role, userInfo to localStorage and updates state.
//  * @param {Object} credentials - Login credentials
//  * @param {string} credentials.emailOrUsername - Email or username
//  * @param {string} credentials.password - Password
//  * @returns {Promise<Object>} User data including role, token, username, failCount
//  */
// const login = async (credentials) => {
//   const res = await loginApi(credentials);
//   const loginUser = res.data.data;

//   // Save login data to localStorage
//   localStorage.setItem("accessToken", loginUser.token);
//   localStorage.setItem("role", loginUser.role);
//   localStorage.setItem("userInfo", JSON.stringify(loginUser));

//   // Update state
//   setIsLoggedIn(true);
//   setRole(loginUser.role);

//   // Fetch full user profile
//   try {
//     const userRes = await getCurrentUserApi();
//     const fullUser = userRes.data.data;
//     setUser(fullUser);
//     const fullName = `${fullUser.firstName} ${fullUser.lastName}`;
//     setUserFullName(fullName);
//     localStorage.setItem("user", JSON.stringify(fullUser));
//     localStorage.setItem("userFullName", fullName);
//   } catch (error) {
//     console.error("Failed to fetch user profile:", error);
//   }

//   return loginUser;
// };

//   const logout = () => {
//     localStorage.clear();
//     setIsLoggedIn(false);
//     setRole(null);
//     setUser(null);
//     setUserFullName("");
//   };

//   // Load user on mount if logged in
//   useEffect(() => {
//     const loadUser = async () => {
//       const token = localStorage.getItem("accessToken");
//       if (token && !user) {
//         try {
//           const userRes = await getCurrentUserApi();
//           const fullUser = userRes.data.data;
//           setUser(fullUser);
//           const fullName = `${fullUser.firstName} ${fullUser.lastName}`;
//           setUserFullName(fullName);
//           localStorage.setItem("user", JSON.stringify(fullUser));
//           localStorage.setItem("userFullName", fullName);
//         } catch (error) {
//           console.error("Failed to load user:", error);
//           // If fetch fails, logout
//           logout();
//         }
//       }
//     };
//     if (isLoggedIn) {
//       loadUser();
//     }
//   }, [isLoggedIn, user]);

//   const refreshUser = async () => {
//     try {
//       const userRes = await getCurrentUserApi();
//       const fullUser = userRes.data.data;
//       setUser(fullUser);
//       const fullName = `${fullUser.firstName} ${fullUser.lastName}`;
//       setUserFullName(fullName);
//       localStorage.setItem("user", JSON.stringify(fullUser));
//       localStorage.setItem("userFullName", fullName);
//     } catch (error) {
//       console.error("Failed to refresh user:", error);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         isLoggedIn,
//         role,
//         user,
//         userFullName,
//         login,
//         logout,
//         refreshUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useContext, useState } from "react";
import { loginApi } from "../services/authService";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("accessToken"),
  );
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (credentials) => {
    const res = await loginApi(credentials);
    const loginUser = res.data.data;

    // Lưu dữ liệu login
    localStorage.setItem("accessToken", loginUser.token);
    localStorage.setItem("role", loginUser.role);
    localStorage.setItem("user", JSON.stringify(loginUser));

    setIsLoggedIn(true);
    setRole(loginUser.role);
    setUser(loginUser);

    return loginUser; 
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
