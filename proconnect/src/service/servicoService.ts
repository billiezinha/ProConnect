import { CreateServicoPayload, Servico } from "@/interfaces/ServicoProps";
import api from "./api";

export async function createServico(data: CreateServicoPayload): Promise<Servico> {
  const resp = await api.post<Servico>("/servicos", data);
  return resp.data;
}

export async function getServicos(): Promise<Servico[]> {
  const resp = await api.get<Servico[]>("/servicos");
  return resp.data;
}

export async function getServicoById(id: number): Promise<Servico> {
  const resp = await api.get<Servico>(`/servicos/${id}`);
  return resp.data;
}