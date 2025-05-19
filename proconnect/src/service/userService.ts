import { CreateUserPayload, User } from "@/interfaces/UserProps";
import api from "./api";


export async function createUser(data: CreateUserPayload): Promise<User> {
  const resp = await api.post<User>("/usuario", data);
  return resp.data;
}

export async function getUser(id: number): Promise<User> {
  const resp = await api.get<User>(`/usuario/${id}`);
  return resp.data;
}

export async function updateUser(
  id: number,
  data: Partial<CreateUserPayload>
): Promise<User> {
  const resp = await api.put<User>(`/usuario/${id}`, data);
  return resp.data;
}

export async function deleteUser(id: number): Promise<{ message: string }> {
  const resp = await api.delete<{ message: string }>(`/usuario/${id}`);
  return resp.data;
}
