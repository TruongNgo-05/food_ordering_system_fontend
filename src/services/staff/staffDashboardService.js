import apiClient from "../apiClient";

const staffDashboardService = {
  getDashboard: () => {
    return apiClient.get("/staff/dashboard");
  },
};

export default staffDashboardService;
