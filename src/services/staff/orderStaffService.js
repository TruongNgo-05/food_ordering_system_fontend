import api from "../apiClient";
const orderStaffService = {
  getAllOrderOnline: (params) => api.get("/staff/orders-online", { params }),

  getAllOrderOffline: (params) => api.get("/staff/orders-offline", { params }),

  getOrderDetail: (id) => api.get(`/staff/orders/${id}`),

 // =========================
  // XÁC NHẬN ĐƠN
  // =========================

  confirmOrder: (id) =>
    api.put(`/staff/orders/${id}/confirm`),


  // =========================
  // HỦY ĐƠN
  // =========================

  cancelOrder: (id) =>
    api.put(`/staff/orders/${id}/cancel`),


  // =========================
  // CẬP NHẬT TRẠNG THÁI
  // =========================

  updateOrderStatus: (id, status) =>
    api.put(`/staff/orders/${id}/status`, null, {
      params: { status },
    }),
};

export default orderStaffService;
