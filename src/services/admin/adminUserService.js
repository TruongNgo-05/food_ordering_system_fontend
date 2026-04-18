import api from "../apiClient";
const adminUserService = {
  getAllUser: (params) => api.get("/admin/users",{params}),

  getUserById: (id) => api.get(`/admin/users/${id}`),

  // createUser: (data) => api.post("/admin/user", data),

  // updateUser: (id, data) =>
  //   api.put(`/admin/user/${id}`, data),

  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  unlockUser: (id) => api.put(`/auth/admin/account/unlock/${id}`),

  lockUser: (id) => api.put(`/auth/admin/account/lock/${id}`),
};
export default adminUserService;
