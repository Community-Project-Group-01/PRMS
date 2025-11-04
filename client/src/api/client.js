import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message || "";

      // Check if token expired or invalid
      if (
        errorMessage.includes("expired") ||
        errorMessage.includes("Invalid token") ||
        errorMessage.includes("Unauthorised Access")
      ) {
        // Clear local storage
        localStorage.clear();

        // Redirect to login page
        // Avoid redirect if already on login page to prevent infinite loops
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
