import api from "../apiClient";
const bannerService = {
  getBannerAdmin: () => api.get("/admin/banner"),

  createBanner: (data) => api.post("/admin/banner", data),

  updateBanner: (id, data) => api.put(`/admin/banner/${id}`, data),

  deleteBanner: (id) => api.delete(`/admin/banner/${id}`),
};
export default bannerService;
