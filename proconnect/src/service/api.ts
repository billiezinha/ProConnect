import axios from "axios";

const api = axios.create({
  baseURL: "https://proconnect.koyeb.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
