import api from "./api";

export interface ServicoRealizadoProps {
  id: number;
  servicoId: number;
  usuarioId: number;
  confirmado: boolean;
}

export async function criarServicoRealizado(servicoId: number): Promise<ServicoRealizadoProps> {
  const { data } = await api.post<ServicoRealizadoProps>("/servico-realizado", { servicoId });
  return data;
}

export async function confirmarServicoRealizado(servicoId: number, confirmado: boolean): Promise<ServicoRealizadoProps> {
  const { data } = await api.patch<ServicoRealizadoProps>("/servico-realizado/confirmar", { servicoId, confirmado });
  return data;
}

export async function listarServicosRealizados(): Promise<ServicoRealizadoProps[]> {
  const { data } = await api.get<ServicoRealizadoProps[]>("/servico-realizado");
  return data;
}