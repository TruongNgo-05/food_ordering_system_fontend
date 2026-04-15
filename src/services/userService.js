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

//Cho user hoạt động lại
export const unlockUser = (id) => {
  return api.put(`/auth/admin/account/unlock/${id}`);
};
//Khóa user
export const lockUser = (id) => {
  return api.put(`/auth/admin/account/lock/${id}`);
};

export const getUserById = (id) => {
  return api.get(`/users/${id}`);
};

// Xóa user
// DELETE /api/users/{id}
export const deleteUser = (id) => {
  return api.delete(`/users/${id}`);
};
