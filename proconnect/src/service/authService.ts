import { LoginPayload } from "@/interfaces/LoginProps";
import api from "./api";

export async function loginUser(payload: LoginPayload): Promise<string> {
  const { data } = await api.post<{ token: string }>("/login", payload);
  return data.token;
}