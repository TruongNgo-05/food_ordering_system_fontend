import api from "./apiClient";
/**
 * Lấy thông tin user hiện tại
 * GET /api/users/me
 */
export const getCurrentUserApi = () => {
  return api.get("/users/me");
};
/**
 * Cập nhật thông tin cá nhân
 * PUT /api/users/profile
 */
export const updateProfileApi = (data) => {
  return api.put("/users/profile", data);
};

/**
 * Đổi mật khẩu
 * POST /api/users/change-password
 */
export const changePasswordApi = (data) => {
  return api.put("/users/change-password", data);
};
///users?page=0&size=5
export const getUsers = (params = {}) => {
  return api.get("/users", { params: { size: 5, ...params } });
};
//Cho user hoạt động lại
export const unlockUser = (id) => {
  return api.put(`/auth/admin/account/unlock/${id}`);
};
//Khóa user
export const lockUser = (id) => {
  return api.put(`/auth/admin/account/lock/${id}`);
};

export const getStudentsByClass = (classId) => {
  return api.get(`/users/students/class-id/${classId}`);
};
///users/teachers/class-id/{classId}
export const getTeachersByClass = (classId) => {
  return api.get(`/users/teachers/class-id/${classId}`);
};
///users/teachers
export const getTeachers = () => {
  return api.get("/users/teachers");
};
// ///users/students
export const getStudents = () => {
  return api.get("/users/students");
};

// Thêm user mới
// POST /api/users
// Body: { username, password, firstName, lastName, email, role }
export const addUser = (userData) => {
  return api.post("/users", userData);
};

// Cập nhật thông tin user
// PUT /api/users/{id}
// Body: { firstName, lastName, email, role }
export const updateUser = (id, data) => {
  return api.put(`/v1/admin/users/${id}`, data);
};

// Lấy thông tin user theo ID
// GET /api/users/{id}
export const getUserById = (id) => {
  return api.get(`/users/${id}`);
};

// Xóa user
// DELETE /api/users/{id}
export const deleteUser = (id) => {
  return api.delete(`/users/${id}`);
};

//users/teachers/class-id/1
