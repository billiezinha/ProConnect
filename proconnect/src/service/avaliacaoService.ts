import api from "./api";

export interface Avaliacao {
  id: number;
  star: number;
  descricao: string;
  criadoEm: string;
  usuario: { nome: string };
}

export interface ResumoAvaliacao {
  mediaEstrelas: number;
  contagemEstrelas: Record<number, number>;
  avaliacoes: Avaliacao[];
}

export async function getAvaliacoesByServico(servicoId: number): Promise<ResumoAvaliacao> {
  const { data } = await api.get<ResumoAvaliacao>(`/avaliacao/${servicoId}`);
  return data;
}

export async function createAvaliacao(data: { star: number; descricao: string; servicoId: number }) {
  const resp = await api.post("/avaliacao", data);
  return resp.data;
}