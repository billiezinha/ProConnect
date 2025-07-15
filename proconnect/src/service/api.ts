import axios from "axios";

const baseURL = "https://proconnectapi.onrender.com";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) config.headers!["Authorization"] = `Bearer ${token}`;
  return config;
});

export default api;