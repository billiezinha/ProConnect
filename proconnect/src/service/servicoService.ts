import { Localizacao, PrecoItem, Servico } from "@/interfaces/ServicoProps";
import api from "./api";

export interface CreateServicoPayload {
  nomeNegocio: string;
  descricao: string;
  preco: PrecoItem[];
  categoriaId: number;
  usuarioId: number;
  localizacao?: Localizacao;
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