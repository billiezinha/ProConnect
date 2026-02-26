import { LoginPayload } from "@/interfaces/LoginProps";
import api from "./api";

export async function loginUser(payload: LoginPayload): Promise<string> {
  const { data } = await api.post<{ token: string }>("/login", payload);
  return data.token;
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  try {
    const { data } = await api.post<{ message: string }>("/usuario/forgot-password", { email });
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Erro ao processar solicitação.");
  }
}

export async function resetPassword(payload: { token: string; novaSenha: string }): Promise<{ message: string }> {
  try {
    const { data } = await api.post<{ message: string }>("/usuario/reset-password", payload);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Erro ao redefinir senha.");
  }
}