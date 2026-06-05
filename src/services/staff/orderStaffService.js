import api from "../apiClient";
const orderStaffService = {
  getAllOrderOnline: (params) => api.get("/staff/orders-online", { params }),

  getAllOrderOffline: (params) => api.get("/staff/orders-offline", { params }),

  getOrderDetail: (id) => api.get(`/staff/orders/${id}`),

  updateOrderStatus: (id, status) =>
    api.put(`/staff/orders/${id}/status`, null, {
      params: { status },
    }),
};
export default orderStaffService;
