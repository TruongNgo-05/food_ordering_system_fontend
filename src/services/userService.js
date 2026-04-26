import api from "./apiClient";
import axios from "axios";
/**
 * Lấy thông tin user hiện tại
 * GET /api/users/me
 */
export const getCurrentUserApi = () => {
  return api.get("/users/me");
};
/**
 * Cập nhật thông tin cá nhân
 * PUT /api/users/profile
 */
export const updateProfileApi = (data, avatarFile) => {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );
  if (avatarFile) {
    formData.append("avatar", avatarFile);
  }
  return api.put("/users/me", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
/**
 * Đổi mật khẩu
 * POST /api/users/change-password
 */
export const changePasswordApi = (data) => {
  return api.put("/users/changePassword", data);
};

export const createAccount = (data) => {
  return api.post("/users", data);
};

export const getBanner = () => {
  return api.get("/users/banner");
};

export const getCategories = (params) => {
  return api.get("/users/categories", { params });
};

export const getFoods = (params) => {
  return api.get("/users/foods", { params });
};

export const getFoodByIdDetail = (id) => {
  return api.get(`/users/foods/${id}`);
};
