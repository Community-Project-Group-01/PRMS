import axios from "axios";

const envUrl = import.meta.env.VITE_API_URL?.trim();
const rawBase = envUrl ? envUrl.replace(/\/$/, "") : "";
const baseURL = rawBase ? rawBase.replace(/\/api$/, "") : "";

const api = axios.create({
  baseURL,
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
