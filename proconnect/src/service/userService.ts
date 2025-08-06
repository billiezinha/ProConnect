import { CreateUserPayload, User } from "@/interfaces/UserProps";
import api from "./api";

export async function createUser(data: CreateUserPayload): Promise<User> {
  const resp = await api.post<User>("/usuarios", data);
  return resp.data;
}

export async function getUser(id: number): Promise<User> {
  const resp = await api.get<User>(`/usuarios/${id}`);
  return resp.data;
}