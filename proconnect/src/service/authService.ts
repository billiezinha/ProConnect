import { LoginPayload } from "@/interfaces/LoginProps";
import api from "./api";

export async function loginUser(payload: LoginPayload): Promise<string> {
  const { data } = await api.post<{ token: string }>("/auth/login", payload);
  return data.token;
}