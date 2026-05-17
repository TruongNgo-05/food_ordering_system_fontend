import api from "../apiClient";
const adminUserService = {
  getAllUser: (params) => api.get("/admin/account", { params }),

  getUserById: (id) => api.get(`/admin/account/${id}`),

  createUser: (data) => api.post("/account", data),

  updateUser: (id, data) => api.put(`/admin/account/${id}`, data),

  deleteUser: (id) => api.delete(`/admin/account/${id}`),

  unlockUser: (id) => api.put(`/admin/account/unlock/${id}`),

  lockUser: (id) => api.put(`/admin/account/lock/${id}`),
};
export default adminUserService;
