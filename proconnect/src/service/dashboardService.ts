import api from "./api";

export interface DashboardMetricas {
  cliquesWhatsapp: { atual: number; variacao: number };
  favoritos: { atual: number; variacao: number };
  avaliacoes: { media: number; total: number; variacao: number };
  servicosRealizados: { atual: number; agendados: number; concluidos: number; variacao: number };
  visualizacoes: { atual: number; variacao: number };
  clientesUnicos: { atual: number; variacao: number };
  taxaConversao: { cliques: number; realizados: number; taxa: number };
  horarioDePico: { hora: number; total: number; distribuicao: { hora: number; total: number }[] };
  avaliacaoGeral: { media: number; total: number };
}

export interface DashboardRanking {
  posicao: number;
  total: number;
  percentil: number;
}

export interface DashboardServico {
  id: number;
  nomeNegocio: string;
  total: number;
}

export interface DashboardResponse {
  periodo: string;
  metricas: DashboardMetricas;
  ranking: DashboardRanking;
  servicosMaisVisualizados: DashboardServico[];
  servicosMaisFavoritados: DashboardServico[];
  insights: string[];
}

export async function getDashboard(periodo: string = "mes"): Promise<DashboardResponse> {
  const resp = await api.get<DashboardResponse>(`/dashboard?periodo=${periodo}`);
  return resp.data;
}
