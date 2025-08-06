import axios from "axios";

// Lê a URL da API das variáveis de ambiente
const baseURL = process.env.NEXT_PUBLIC_API_URL;

// Lança um erro claro se a variável não for encontrada
if (!baseURL) {
  throw new Error("A variável de ambiente NEXT_PUBLIC_API_URL não está definida. Verifique o seu ficheiro .env.local.");
}

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Adiciona o token de autenticação a cada requisição
api.interceptors.request.use(
  (config) => {
    // Garante que o código só corre no lado do cliente (navegador)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        // Garante que o objeto de cabeçalhos existe antes de o modificar
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