import api from "../apiClient";

const tablesStaffService = {
  // Danh sách
  getAllTableStaff: (params) => api.get("/staff/tables", { params }),
};

export default tablesStaffService;
