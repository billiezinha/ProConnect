import { LoginPayload, LoginResponse } from "@/interfaces/LoginProps";
import api from "./api";

export async function loginUser(data: LoginPayload): Promise<string> {
  const resp = await api.post<LoginResponse>("/login", data);
  return resp.data.token;
}
