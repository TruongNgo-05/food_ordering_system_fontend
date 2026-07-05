import api from "./apiClient";

// Login
export const loginApi = (data) => {
  return api.post("/auth/login", data);
};

// Refresh Access Token
export const refreshTokenApi = () => {
  return api.post("/auth/refresh");
};

// Logout
export const logoutApi = () => {
  return api.post("/auth/logout");
};

// Gửi OTP
export const sendOtpApi = (data) => {
  return api.post("/auth/forgot-password", data);
};

// Reset Password
export const resetPasswordApi = (data) => {
  return api.post("/auth/reset-password", data);
};
