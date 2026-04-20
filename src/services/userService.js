import api from "./apiClient";
/**
 * Lấy thông tin user hiện tại
 * GET /api/users/me
 */
export const getCurrentUserApi = () => {
  return api.get("/v1/users/me");
};
/**
 * Cập nhật thông tin cá nhân
 * PUT /api/users/profile
 */
export const updateProfileApi = (data) => {
  return api.put("/v1/users/me", data);
};

/**
 * Đổi mật khẩu
 * POST /api/users/change-password
 */
export const changePasswordApi = (data) => {
  return api.put("/users/change-password", data);
};

export const createAccount = (data) => {
  return api.post("/v1/users", data);
};

export const getBanner = () => {
  return api.get("/v1/users/banner");
};

export const getCategories = (params) => {
  return api.get("/v1/users/categories", { params });
};

export const getFoods = (params) => {
  return api.get("/v1/users/food", { params });
};

export const getFoodById = (id) => {
  return api.get(`/v1/users/food/${id}`);
};
