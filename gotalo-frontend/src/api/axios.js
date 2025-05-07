import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // backend URL
  withCredentials: true, // ✅ for refresh token (stored in cookies)
});

// 👉 Attach access token automatically to headers
// api.interceptors.request.use(
//   (config) => {
//     const token = sessionStorage.getItem("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

export default api;
