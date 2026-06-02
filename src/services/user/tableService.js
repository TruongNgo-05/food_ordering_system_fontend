import api from "../apiClient";

const tableService = {
  getQrTable: () => api.get(`/users/table`),

  menuTable: (params) => api.get("/users/table-order", { params }),

  orderTable: (data) => api.post("/users/order-tb", data),
};

export default tableService;
