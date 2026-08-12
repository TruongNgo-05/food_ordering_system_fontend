import apiClient from "../apiClient";

const adminDashboardService = {
  getDashboard: () => {
    return apiClient.get("/admin/dashboard");
  },
};

export default adminDashboardService;
