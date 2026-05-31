import api from "../apiClient";

const orderService = {
  //  online
  orderOnLine: (data) => api.post(`/customer/order`, data),

  myOrders: (params) => api.get("/customer/order/my-orders", { params }),

  myOrderDetail: (id) => api.get(`/customer/order/${id}`),

  cancelOrder: (idOrder) => api.put(`/customer/order/${idOrder}/cancel`),

  reorderOrder: (idOrder) => api.post(`/customer/order/${idOrder}/reorder`),




  // order table 
  
};

export default orderService;
