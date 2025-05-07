import axios from "axios";

// ✅ Create Axios instance
const API = axios.create({
  baseURL: "http://localhost:3000/api", // adjust if needed
  withCredentials: true, // required to send/receive cookies like refresh token
});

// ✅ Request interceptor to attach access token
API.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor to handle token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token is expired & not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await API.get("/auth/refresh"); // your refresh endpoint

        const newAccessToken = res.data.accessToken;
        sessionStorage.setItem("accessToken", newAccessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        // Refresh token also failed
        sessionStorage.removeItem("accessToken");
        window.location.href = "/login"; // optional: redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ✅ Login user and store token
export const loginUser = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  sessionStorage.setItem("accessToken", res.data.accessToken);
  return res;
};

// ✅ Logout user
export const logoutUser = async () => {
  sessionStorage.removeItem("accessToken");
  return await API.post("/auth/logout");
};

// ✅ Get current user
export const getCurrentUser = async () => {
  return await API.get("/auth/me");
};

export default API;
