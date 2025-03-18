import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333", // Altere para o endereço do backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
