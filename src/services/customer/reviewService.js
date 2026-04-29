import api from "../apiClient";
const reviewService = {
  getReviewByFood: (foodId) => api.get(`/customer/review/${foodId}`),

  createReview: (data) => api.post("/customer/review", data),

  updateReview: (id, data) => api.put(`/customer/review/${id}`, data),

  deleteReview: (id) => api.delete(`/customer/review/${id}`),
};
export default reviewService;
