import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      if (!window.location.pathname.includes("/login")) {
        window.dispatchEvent(new Event("auth:expired"));
      }
    }

    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (error, fallbackMessage) => {
  if (!error.response) {
    return `The backend server is unavailable. Make sure it is running on ${API_BASE_URL}.`;
  }

  return error.response.data?.message || fallbackMessage;
};

export default api;
