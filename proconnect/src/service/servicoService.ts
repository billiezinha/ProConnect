import api from "./api";
import type { Servico, UpdateServicoPayload } from "@/interfaces/ServicoProps";

// 1. Cria o serviço enviando JSON puro (Nomes em minúsculo conforme o seu backend)
export async function createServico(data: {
  nomeNegocio: string;
  descricao: string;
  categoriaId: number;
  preco: { nomeservico: string; precificacao: number }[];
}): Promise<Servico> {
  const resp = await api.post<Servico>("/servico", data);
  return resp.data;
}

// 2. Rota para upload das imagens (Usando o ID que o backend gerou)
export async function uploadImagemServico(id: number, formData: FormData): Promise<void> {
  await api.patch(`/servico/${id}/imagem`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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