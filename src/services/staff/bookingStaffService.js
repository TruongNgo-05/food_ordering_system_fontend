import api from "../apiClient";

const bookingStaffService = {
  getAllBooking: (params) => api.get("/staff/table-reservations", { params }),
};
export default bookingStaffService;
