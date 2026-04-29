import api from "../apiClient";

const addressService = {
  getMyAddresses: () => api.get(`/customer/address`),

  createAddress: (data) => api.post(`/customer/address`, data),

  updateAddress: (id, data) => api.put(`/customer/address/${id}`, data),

  deleteAddress: (id) => api.delete(`/customer/address/${id}`),
};

export default addressService;
