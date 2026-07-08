import api from "../apiClient";

const adminSupportService = {
  // Danh sách yêu cầu hỗ trợ
  getAllTickets: (params) =>
    api.get("/admin/support", { params }),

  // Chi tiết yêu cầu
  getTicketById: (id) =>
    api.get(`/admin/support/${id}`),

  // Trả lời khách hàng
  replyTicket: (id, data) =>
    api.put(`/admin/support/${id}/reply`, data),

  // Đánh dấu đã giải quyết
  resolveTicket: (id) =>
    api.put(`/admin/support/${id}/resolve`),

  // Xóa yêu cầu
  deleteTicket: (id) =>
    api.delete(`/admin/support/${id}`),
};

export default adminSupportService;