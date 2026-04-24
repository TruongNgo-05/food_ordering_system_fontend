import api from "../apiClient";

const adminFoodService = {
  // ================= GET =================
  getFoodAdmin: (params) => api.get("/admin/foods", { params }),

  getFoodDetailAdmin: (id) => api.get(`/admin/foods/${id}`),

  createFood: (data, image, images) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    if (image) formData.append("image", image);

    if (images && images.length > 0) {
      images.forEach((img) => formData.append("images", img));
    }

    return api.post("/admin/foods", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  updateFood: (id, data, image, images) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    if (image) formData.append("image", image);

    if (images && images.length > 0) {
      images.forEach((img) => formData.append("images", img));
    }

    return api.put(`/admin/foods/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // ================= DELETE =================
  deleteFood: (id) => api.delete(`/admin/foods/${id}`),
};

export default adminFoodService;
