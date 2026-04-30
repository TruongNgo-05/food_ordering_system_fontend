import api from "../apiClient";
const adminVoucherService = {
  getAllVoucher: (params) => api.get("/admin/voucher", { params }),

  getVoucherDetail: (id) => api.get(`/admin/voucher/${id}`),

  createVoucher: (data) => api.post("/admin/voucher", data),

  updateVoucher: (id, data) => api.put(`/admin/voucher/${id}`, data),

  deleteVoucher: (id) => api.delete(`/admin/voucher/${id}`),
};
export default adminVoucherService;
