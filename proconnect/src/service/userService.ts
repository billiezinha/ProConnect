import { CreateUserPayload, User } from "@/interfaces/UserProps";
import api from "./api";

/**
 * Cria um novo utilizador.
 * @param data - Dados do novo utilizador.
 */
export async function createUser(data: CreateUserPayload): Promise<User> {
  // A rota agora tem o prefixo /usuarios
  const resp = await api.post<User>("/usuarios", data);
  return resp.data;
}

/**
 * Obtém os dados de um utilizador pelo seu ID.
 * @param id - ID do utilizador.
 */
export async function getUser(id: number): Promise<User> {
  // A rota agora tem o prefixo /usuarios
  const resp = await api.get<User>(`/usuarios/${id}`);
  return resp.data;
}

/**
 * Atualiza os dados de um utilizador.
 * @param id - ID do utilizador a ser atualizado.
 * @param data - Dados a serem atualizados.
 */
export async function updateUser(id: number, data: Partial<CreateUserPayload>): Promise<User> {
  // A rota agora tem o prefixo /usuarios
  const resp = await api.put<User>(`/usuarios/${id}`, data);
  return resp.data;
}