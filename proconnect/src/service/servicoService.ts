import api from "./api";
import type { CreateServicoPayload, Servico, UpdateServicoPayload } from "@/interfaces/ServicoProps";

export async function createServico(data: CreateServicoPayload): Promise<Servico> {
  const resp = await api.post<Servico>("/servico", data);
  return resp.data;
}

export async function getServicos(): Promise<Servico[]> {
  const resp = await api.get<Servico[]>("/servico");
  return resp.data;
}

export async function getServicoById(id: number): Promise<Servico> {
  const resp = await api.get<Servico>(`/servico/${id}`);
  return resp.data;
}

export async function getMeusServicos(): Promise<Servico[]> {
  const resp = await api.get<Servico[]>("/usuario/me/servicos");
  return resp.data;
}

export async function updateServico(id: number, data: UpdateServicoPayload): Promise<Servico> {
  const resp = await api.put<Servico>(`/servico/${id}`, data);
  return resp.data;
}

export async function deleteServico(id: number): Promise<void> {
  await api.delete(`/servico/${id}`);
}
