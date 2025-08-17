import axios from "axios";

// URL FORÇADA PARA TESTES LOCAIS. ISTO VAI FUNCIONAR.
// const baseURL = "https://proconnectapi-1.onrender.com";

const baseURL = "https://proconnectapi-2.onrender.com/";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        if (!config.headers) {
          config.headers = {};
        }
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;