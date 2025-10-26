import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // 👈 your backend base URL
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // optional timeout
});

// ✅ Optional: interceptors for logging or auth token
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} → ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
