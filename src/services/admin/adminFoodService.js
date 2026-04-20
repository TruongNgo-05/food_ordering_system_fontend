import api from "../apiClient";
const adminFoodService = {
  getFoodAdmin: (params) => api.get("/admin/food", {params}),

  getFoodDetailAdmin: (id) => api.get(`/admin/food/${id}`),

  createFood: (data) => api.post("/admin/food", data),

  updateFood: (id, data) => api.put(`/admin/food/${id}`, data),

  deleteFood: (id) => api.delete(`/admin/food/${id}`),
};
export default adminFoodService;
