import api from "./api";

export interface AssinaturaInfo {
  tipo: string;
  status: string;
  duracao: string;
  descricao: string;
}

export interface Pagamento {
  id: number;
  mpPaymentId: string;
  valor: number;
  status: string;
  metodoPagamento: string;
  criadoEm: string;
  assinatura: AssinaturaInfo | null;
}

export interface HistoricoPagamentoResponse {
  total: number;
  pagamentos: Pagamento[];
}

export async function getHistoricoPagamentos(): Promise<HistoricoPagamentoResponse> {
  const resp = await api.get<HistoricoPagamentoResponse>("/pagamento/historico");
  return resp.data;
}
