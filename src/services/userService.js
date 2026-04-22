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
export const updateProfileApi = (data) => {
  return api.put("/users/me", data);
};
export const uploadAvatarApi = (id, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(`/users/upload-avatar/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
/**
 * Đổi mật khẩu
 * POST /api/users/change-password
 */
export const changePasswordApi = (data) => {
  return api.put("/users/change-password", data);
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
