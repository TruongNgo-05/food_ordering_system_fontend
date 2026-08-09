import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ======================================================
// REQUEST INTERCEPTOR
// Tự động gắn Access Token vào mỗi request
// ======================================================

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ======================================================
// REFRESH TOKEN QUEUE
// ======================================================

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// ======================================================
// CLEAR AUTH
// ======================================================

const clearAuth = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
  localStorage.removeItem("userFullName");
};

// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================

api.interceptors.response.use(
  // API thành công
  (response) => {
    return response;
  },

  // API lỗi
  async (error) => {
    const originalRequest = error.config;

    // Không có request
    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // ==================================================
    // KHÔNG REFRESH LẠI CHÍNH API REFRESH
    // ==================================================

    const requestUrl = originalRequest.url || "";

    const isRefreshRequest = requestUrl.includes("/auth/refresh");

    const isLoginRequest = requestUrl.includes("/auth/login");

    const isLogoutRequest = requestUrl.includes("/auth/logout");

    if (isRefreshRequest || isLoginRequest || isLogoutRequest) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // ==================================================
    // ĐANG CÓ REQUEST KHÁC REFRESH
    // ==================================================

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      }).then((newAccessToken) => {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      });
    }

    // ==================================================
    // BẮT ĐẦU REFRESH
    // ==================================================

    isRefreshing = true;

    try {
      console.log("Access Token hết hạn → Refresh Token");

      const response = await axios.post(
        `${API_URL}/auth/refresh`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const newAccessToken = response.data?.data?.accessToken;

      if (!newAccessToken) {
        throw new Error("Refresh thành công nhưng không có Access Token");
      }

      localStorage.setItem("accessToken", newAccessToken);

      console.log("Refresh thành công");

      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      console.error("Refresh Token thất bại:", refreshError);

      processQueue(refreshError);

      clearAuth();

      window.location.href = "/login";

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
