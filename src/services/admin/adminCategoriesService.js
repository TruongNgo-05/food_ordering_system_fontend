import api from "../apiClient";
const adminCategoriesService = {
  createCategories: (data) => api.post("/admin/categories", data),

  updateCategories: (id, data) => api.put(`/admin/categories/${id}`, data),

  deleteCategories: (id) => api.delete(`/admin/categories/${id}`),
};
export default adminCategoriesService;
