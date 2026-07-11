import api from "./apiClient";

const sepayService = {
  // Kiểm tra trạng thái thanh toán
  getPaymentStatus: (orderCode) => api.get(`/sepay/status/${orderCode}`),

  // Hủy đơn chờ thanh toán
  deletePendingOrder: (orderCode) => api.delete(`/sepay/pending/${orderCode}`),
};

export default sepayService;
