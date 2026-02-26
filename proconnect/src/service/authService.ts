import { LoginPayload } from "@/interfaces/LoginProps";
import api from "./api";

// Função de Login que você já possuía
export async function loginUser(payload: LoginPayload): Promise<string> {
  const { data } = await api.post<{ token: string }>("/login", payload);
  return data.token;
}

// CORREÇÃO: Tipando o retorno do post para bater com o Promise
export async function forgotPassword(email: string): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>("/forgot-password", { email });
  return data;
}

// CORREÇÃO: Tipando o retorno do post para bater com o Promise
export async function resetPassword(payload: { token: string; novaSenha: string }): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>("/reset-password", payload);
  return data;
}