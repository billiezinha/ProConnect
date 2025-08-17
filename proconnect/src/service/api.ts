// src/service/api.ts
import axios from "axios";

/** Base URL
 * - Usa NEXT_PUBLIC_API_URL quando existir
 * - Fallback para o Render
 * - Remove barra final para evitar '//' nas rotas
 */
const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://proconnectapi-2.onrender.com"
).replace(/\/+$/, "");

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

/** --- Helpers de type guard (sem AxiosError) --- */
type ApiErrorBody = { message?: string; error?: string };

function getResponseStatus(err: unknown): number | undefined {
  if (typeof err === "object" && err !== null && "response" in err) {
    const resp = (err as { response?: { status?: number } }).response;
    return resp?.status;
  }
  return undefined;
}

function getResponseData(err: unknown): ApiErrorBody | undefined {
  if (typeof err === "object" && err !== null && "response" in err) {
    const resp = (err as { response?: { data?: unknown } }).response;
    if (resp?.data && typeof resp.data === "object") {
      return resp.data as ApiErrorBody;
    }
  }
  return undefined;
}

/** Anexa token (somente no browser) */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/** Normaliza erros e trata 401 */
api.interceptors.response.use(
  (res) => res,
  (error: unknown) => {
    const status = getResponseStatus(error);
    const data = getResponseData(error);
    const message =
      data?.message ||
      data?.error ||
      (error instanceof Error ? error.message : "Erro de rede");

    if (status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    return Promise.reject(new Error(message));
  }
);

export default api;

/** Uso no servidor (SSR/Server Actions) quando você tiver o token em cookie/header */
export function makeServerApi(token?: string) {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    timeout: 15000,
  });
}
