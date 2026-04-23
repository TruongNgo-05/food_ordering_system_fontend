import api from "../apiClient";

const adminFoodService = {
  // ================= GET =================
  getFoodAdmin: (params) => api.get("/admin/foods", { params }),

  getFoodDetailAdmin: (id) => api.get(`/admin/foods/${id}`),

  // ================= CREATE =================
  createFood: (data, image, images) => {
    const formData = new FormData();

    formData.append(
      "data",
      new Blob([JSON.stringify(data)], { type: "application/json" }),
    );

    if (image) {
      formData.append("image", image);
    }

    if (images && images.length > 0) {
      images.forEach((img) => {
        formData.append("images", img);
      });
    }

    return api.post("/admin/foods", formData);
  },

  // ================= UPDATE =================
  updateFood: (id, data, image, images) => {
    const formData = new FormData();

    formData.append("data", JSON.stringify(data));

    if (image) {
      formData.append("image", image);
    }

    if (images && images.length > 0) {
      images.forEach((img) => {
        formData.append("images", img);
      });
    }

    return api.put(`/admin/foods/${id}`, formData);
  },

  // ================= DELETE =================
  deleteFood: (id) => api.delete(`/admin/foods/${id}`),
};

export default adminFoodService;
