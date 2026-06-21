import api from "../apiClient";

const bookingStaffService = {
  // Danh sách
  getAllBooking: (params) => api.get("/staff/table-reservations", { params }),

  // Chi tiết
  getDetailBooking: (id) => api.get(`/staff/table-reservations/${id}`),

  // Check-in
  checkInBooking: (id) => api.put(`/staff/table-reservations/${id}/check-in`),

  // Hủy đặt bàn
  cancelBooking: (id) => api.put(`/staff/table-reservations/${id}/cancel`),

  // Hoàn thành
  completeBooking: (id) => api.put(`/staff/table-reservations/${id}/complete`),
};

export default bookingStaffService;
