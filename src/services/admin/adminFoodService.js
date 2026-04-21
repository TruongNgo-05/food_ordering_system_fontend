import api from "../apiClient";
const adminFoodService = {
  getFoodAdmin: (params) => api.get("/admin/foods", { params }),

  getFoodDetailAdmin: (id) => api.get(`/admin/foods/${id}`),

  createFood: (data) => api.post("/admin/foods", data),

  updateFood: (id, data) => api.put(`/admin/foods/${id}`, data),

  deleteFood: (id) => api.delete(`/admin/foods/${id}`),
};
export default adminFoodService;
