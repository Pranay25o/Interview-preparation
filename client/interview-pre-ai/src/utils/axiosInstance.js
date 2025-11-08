import axios from "axios";
import { BASE_URL } from "./apiPath";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000, // ⏱️ Increased from 8000 → 20000 (20 seconds)
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor (with retry on timeout)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("Response interceptor error:", error);

    // Handle timeout retry once
    if (error.code === "ECONNABORTED" && !error.config._retry) {
      error.config._retry = true;
      console.warn("⚠️ Request timed out — retrying once...");
      return axiosInstance.request(error.config);
    }

    // Handle server responses
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 401:
          console.error("Unauthorized - redirecting to login");
          localStorage.removeItem("token");
          window.location.href = "/";
          break;
        case 403:
          console.error("Forbidden - insufficient permissions");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Server error. Please try again later");
          break;
        default:
          console.error(`HTTP Error ${status}:`, error.response.data);
      }
    } else if (error.request) {
      console.error("Network error or no response from server");
    } else {
      console.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
