import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3333"
    : "https://proconnectapi.onrender.com";

// 🔽 crie a API ANTES de usar o interceptador
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔽 agora sim pode usar
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) config.headers!["Authorization"] = `Bearer ${token}`;
  return config;
});

export default api;