import api from "./api";

// Interface para o que o Front-end espera
export interface ResumoAvaliacao {
  media: number;
  total: number;
  avaliacoes?: any[]; // Opcional: útil se quiser listar os comentários na tela
  contagemEstrelas?: Record<number, number>;
}

// Interface baseada na resposta real do seu Back-end (Controller)
interface BackendResponse {
  mediaEstrelas: number;
  contagemEstrelas: Record<number, number>;
  avaliacoes: any[];
}

/**
 * Busca o resumo de avaliações de um serviço.
 * Rota no Back-end: GET /avaliacao/:id
 */
export async function getAvaliacoesByServico(servicoId: number): Promise<ResumoAvaliacao> {
  // Segurança: Evita chamadas com ID inválido que resultam em 404
  if (!servicoId) {
    return { media: 0, total: 0, avaliacoes: [] };
  }

  try {
    // Timestamp adicionado para quebrar o cache do navegador e do Next.js
    const timestamp = new Date().getTime();
    const { data } = await api.get<BackendResponse>(`/avaliacao/${servicoId}?t=${timestamp}`);
    
    // Mapeamento completo
    return {
      media: data.mediaEstrelas || 0,
      total: data.avaliacoes ? data.avaliacoes.length : 0,
      avaliacoes: data.avaliacoes || [],
      contagemEstrelas: data.contagemEstrelas || {}
    };
  } catch (error: any) {
    // Se o serviço não tiver avaliações (404), retornamos valores zerados
    if (error.response && (error.response.status === 404 || error.response.status === 403)) {
      return { media: 0, total: 0, avaliacoes: [] };
    }
    
    console.error("Erro ao carregar avaliações:", error);
    return { media: 0, total: 0, avaliacoes: [] };
  }
}

/**
 * Envia uma nova avaliação.
 * Rota no Back-end: POST /avaliacao
 */
export async function criarAvaliacao(payload: { servicoId: number; nota: number; comentario?: string }) {
  // Mapeamento: O Controller do Back-end espera os campos 'star' e 'descricao'
  const body = {
    servicoId: payload.servicoId,
    star: payload.nota,         // Front: nota -> Back: star
    descricao: payload.comentario || "" // Front: comentario -> Back: descricao
  };

  const { data } = await api.post("/avaliacao", body);
  return data;
}

// Exportação adicional para compatibilidade
export const createAvaliacao = criarAvaliacao;