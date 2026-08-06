import api from "../apiClient";

const tablesStaffService = {
  getAllTableStaff: (params) => api.get("/staff/tables", { params }),

  receiveCustomer: (id) => api.put(`/staff/tables/${id}/receive`),

  cancelReceive: (id) => api.put(`/staff/tables/${id}/cancel-receive`),

  checkoutTable: (id) => api.put(`/staff/tables/${id}/checkout`),
};

export default tablesStaffService;
