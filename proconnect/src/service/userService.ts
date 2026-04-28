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
  let user = resp.data;
  
  // Workaround: O backend do Render não está retornando o campo "plano".
  // Vamos tentar acessar uma rota premium (dashboard) para descobrir se o usuário é PRO.
  if (user && user.plano !== "premium") {
    try {
      await api.get("/dashboard?periodo=mes");
      user.plano = "premium"; // Se não deu erro de permissão (403), ele é premium!
    } catch (e) {
      // Ignora, ele realmente é gratuito
    }
  }
  
  return user;
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

// ✨ FUNÇÃO CORRIGIDA: 
// Recebe o ID para não quebrar o teu Perfil, mas envia o PUT para a rota "/usuario/me"
export async function updateMe(id: number, data: Partial<User>): Promise<User> {
  const resp = await api.put<User>("/usuario/me", data);
  return resp.data;
}

// Remove a conta do usuário
export async function deleteAccount(): Promise<void> {
  await api.delete("/usuario/me");
}