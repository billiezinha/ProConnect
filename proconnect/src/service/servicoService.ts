// Importa as interfaces corretas da nossa fonte da verdade
import { CreateServicoPayload, Servico } from "@/interfaces/ServicoProps";
import api from "./api";

/**
 * Cria um novo serviço.
 */
export async function createServico(data: CreateServicoPayload): Promise<Servico> {
  const resp = await api.post<Servico>("/servicos", data);
  return resp.data;
}

/**
 * Obtém todos os serviços.
 */
export async function getServicos(): Promise<Servico[]> {
  const resp = await api.get<Servico[]>("/servicos");
  return resp.data;
}

/**
 * Obtém um serviço específico pelo seu ID.
 */
export async function getServicoById(id: number): Promise<Servico> {
  const resp = await api.get<Servico>(`/servicos/${id}`);
  return resp.data;
}