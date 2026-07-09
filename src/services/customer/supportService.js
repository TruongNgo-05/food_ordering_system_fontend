import api from "../apiClient";

const supportService = {
  createSupport: (data) => api.post("/customer/support", data),

  getMySupport: (page = 0, size = 10) =>
    api.get("/customer/support/my-ticket", {
      params: {
        page,
        size,
      },
    }),
};

export default supportService;
