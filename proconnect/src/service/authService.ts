import { LoginPayload } from "@/interfaces/LoginProps";
import api from "./api";

export async function loginUser(payload: LoginPayload): Promise<string> {
  const { data } = await api.post<{ token: string }>("/login", payload);
  return data.token;
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  // Tente remover o primeiro "/usuario" se o seu baseURL já apontar para a rota base
  // Ou adicione o prefixo correto da sua API (ex: /api/usuario/forgot-password)
  const { data } = await api.post<{ message: string }>("/usuario/forgot-password", { email });
  return data;
}

export async function resetPassword(payload: { token: string; novaSenha: string }): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>("/usuario/reset-password", payload);
  return data;
}