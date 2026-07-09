import api from "./apiClient";

const chatService = {
  // =========================
  // CUSTOMER
  // =========================

  // Lấy hoặc tạo conversation
  getConversation: () => api.get("/customer/chat/conversation"),

  // Lấy lịch sử tin nhắn của customer
  getCustomerMessages: () => api.get("/customer/chat/messages"),

  // Customer gửi tin nhắn
  sendCustomerMessage: (data) => api.post("/customer/chat/send", data),

  // Customer đánh dấu đã đọc
  customerMarkAsRead: () => api.put("/customer/chat/read"),

  // =========================
  // STAFF
  // =========================

  // Danh sách cuộc hội thoại
  getConversations: () => api.get("/staff/chat/conversations"),

  // Lấy tin nhắn theo conversation
  getStaffMessages: (conversationId) =>
    api.get(`/staff/chat/messages/${conversationId}`),

  // Staff gửi tin nhắn
  sendStaffMessage: (data) => api.post("/staff/chat/send", data),

  // Staff đánh dấu đã đọc
  staffMarkAsRead: (conversationId) =>
    api.put(`/staff/chat/read/${conversationId}`),
};

export default chatService;
