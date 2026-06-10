import api from "../apiClient";
const adminOrderService = {
  getAllOrder: (params) => api.get("/admin/orders", { params }),
};
export default adminOrderService;
