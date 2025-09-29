import axios from "axios";
import { BASE_URL } from "./apiPath";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 8000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

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

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error("Response interceptor error:", error);
        
        if (error.response) {
            // Server responded with error status
            const status = error.response.status;
            
            switch (status) {
                case 401:
                    console.error("Unauthorized - redirecting to login");
                    localStorage.removeItem("token"); // Clear token
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
        } else if (error.code === "ECONNABORTED") {
            console.error("Request timeout. Please try again later");
        } else if (error.request) {
            // Network error
            console.error("Network error. Please check your connection");
        } else {
            // Other error
            console.error("Request setup error:", error.message);
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;
