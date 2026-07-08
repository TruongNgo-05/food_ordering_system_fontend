import api from "../apiClient";

const supportService = {
  
  createSupport: (data) => api.post("/customer/support", data),

  getMySupport: () => api.get("/customer/support/my-ticket"),

  
};

export default supportService;
