import api from "./api";
import { CreateUserPayload, UpdateUserPayload, User } from "@/interfaces/UserProps";

export async function createUser(data: CreateUserPayload): Promise<User> {
  const resp = await api.post<User>("/usuario", data);
  return resp.data;
}

export async function getUserById(id: number | string): Promise<User> {
  const resp = await api.get<User>(`/usuario/${id}`);
  return resp.data;
}

export async function getMe(): Promise<User> {
  const resp = await api.get<User>("/usuario/me");
  return resp.data;
}

export async function updateUser(id: number | string, payload: UpdateUserPayload): Promise<User> {
  const resp = await api.put<User>(`/usuario/${id}`, payload);
  return resp.data;
}

// Envia a imagem como multipart/form-data
export async function uploadFotoPerfil(formData: FormData): Promise<User> {
  const resp = await api.patch<User>("/usuario/me/imagem", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return resp.data;
}

// Remove a imagem de perfil
export async function removerFotoPerfil(): Promise<void> {
  await api.delete("/usuario/me/imagem");
}