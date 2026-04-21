import api from "./apiClient";
//  Đăng nhập
export const loginApi = (data) => {
  return api.post("/auth/login", data);
};
//  Gửi OTP quên mật khẩu
export const sendOtpApi = (data) => {
  return api.post("/auth/forgot-password", data);
};
//  Đặt lại mật khẩu (email + otp + mật khẩu mới)
export const resetPasswordApi = (data) => {
  return api.post("/auth/reset-password", data);
};
