import api from "./api";
import { Servico } from "@/interfaces/ServicoProps";

export interface PrecoInput {
  nomeservico: string;
  precificacao: number;
}
export interface LocalizacaoInput {
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface CreateServicoPayload {
  nomeNegocio: string;
  descricao: string;
  preco: PrecoInput[];
  categoriaId: number;
  usuarioId: number;
  localizacao?: LocalizacaoInput;
}

export async function createServico(
  payload: CreateServicoPayload
): Promise<Servico> {
  const resp = await api.post<Servico>("/servico", payload);
  return resp.data;
}

export async function getServicos(): Promise<Servico[]> {
  const resp = await api.get<Servico[]>("/servico");
  return resp.data;
}

export async function updateServico(
  id: number,
  payload: Partial<CreateServicoPayload>
): Promise<Servico> {
  const resp = await api.put<Servico>(`/servico/${id}`, payload);
  return resp.data;
}

export async function deleteServico(id: number): Promise<{ message: string }> {
  const resp = await api.delete<{ message: string }>(`/servico/${id}`);
  return resp.data;
}
export async function getServicoById(id: number): Promise<Servico> {
  const resp = await api.get<Servico>(`/servico/${id}`);
  return resp.data;
}
