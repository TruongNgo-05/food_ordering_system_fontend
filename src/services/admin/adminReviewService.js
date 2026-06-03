import api from "../apiClient";
const adminReviewService = {
  getAllFoodReview: (params) => api.get("/admin/food-review",{params}),
};
export default adminReviewService;
