import api from "../apiClient";
const adminTableService = {
  getAllTable: (params) => api.get("/admin/table", { params }),

  getQrTable: () => api.get("/users/table-test"),

  createTable: (data) => api.post("/admin/table", data),

  updateTable: (id, data) => api.put(`/admin/table/${id}`, data),

  deleteTable: (id) => api.delete(`/admin/table/${id}`),
};
export default adminTableService;
