import { LoginPayload } from "@/interfaces/LoginProps";
import api from "./api";

/**
 * Autentica um utilizador.
 * @param payload - Email e senha.
 */
export async function loginUser(payload: LoginPayload): Promise<string> {
  // A rota agora tem o prefixo /auth
  const { data } = await api.post<{ token: string }>("/auth/login", payload);
  return data.token;
}