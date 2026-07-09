import api from "../apiClient";

const adminFAQService = {
  // Thêm FAQ
  createFAQ: (data) => api.post("/admin/faq", data),

  // Cập nhật FAQ
  updateFAQ: (id, data) => api.put(`/admin/faq/${id}`, data),

  // Xóa FAQ
  deleteFAQ: (id) => api.delete(`/admin/faq/${id}`),
};

export default adminFAQService;
