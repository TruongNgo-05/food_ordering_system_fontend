import api from "../apiClient";

const favoriteService = {
  getMyFavorite: () => api.get(`/customer/favorites`),

  toggleFavorite: (itemId) => api.post(`/customer/favorites/toggle/${itemId}`),
};

export default favoriteService;
