import axios from "axios";

const BASE_URL = "http://192.168.0.6:5000/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    // Ensure headers exist safely
    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    console.log("❌ API ERROR:", status, error.response?.data);

    // 🔥 HANDLE TOKEN EXPIRED / INVALID
    if (status === 401) {
      console.log("⚠️ Token expired or invalid — logging out");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      // safer redirect
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;