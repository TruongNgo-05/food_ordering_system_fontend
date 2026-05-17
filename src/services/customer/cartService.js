import api from "../apiClient";

const cartService = {
  getCart: () => api.get(`/customer/cart`),

  addToCart: (data) => api.post(`/customer/cart`, data),

  updateCart: (itemId, data) => api.put(`/customer/cart/${itemId}`, data),

  deleteCart: (itemId) => api.delete(`/customer/cart/${itemId}`),
};

export default cartService;
