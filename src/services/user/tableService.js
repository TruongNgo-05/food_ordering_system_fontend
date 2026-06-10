import api from "../apiClient";

const tableService = {
  getQrTable: () => api.get(`/users/table-test`),

  menuTable: (params) => api.get("/users/table-order", { params }),

  orderTable: (data) => api.post("/users/order-tb", data),

  // booking

  getTables: (params) => api.get("/users/table-book", { params }),

  createBooking: (data) => api.post("/users/table-book", data),
};

export default tableService;
