import api from "./api";

export interface ServicoRealizadoProps {
  id: number;
  servicoId: number;
  clienteId: number;
  profissionalId: number;
  confirmado: boolean;
  dataRealizacao: string;
}

export async function criarServicoRealizado(servicoId: number): Promise<ServicoRealizadoProps> {
  const { data } = await api.post<ServicoRealizadoProps>("/servico-realizado", { servicoId });
  return data;
}

export async function confirmarServicoRealizado(id: number): Promise<ServicoRealizadoProps> {
  const { data } = await api.patch<ServicoRealizadoProps>("/servico-realizado/confirmar", { id });
  return data;
}

export async function listarServicosRealizados(): Promise<ServicoRealizadoProps[]> {
  const { data } = await api.get<ServicoRealizadoProps[]>("/servico-realizado");
  return data;
}