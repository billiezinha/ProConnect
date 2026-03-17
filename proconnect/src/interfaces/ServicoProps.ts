import type { Categoria } from "./CategoriaProps";
import type { User } from "./UserProps";

/** Interface para os itens do Portfólio (Fotos extras) */
export interface PortfolioItem {
  id: number;
  imagem_url: string; // URL da imagem vinda do Supabase
  servicoId: number;
}

/** Item de preço de um serviço já salvo */
export interface PrecoItem {
  id: number;
  nomeservico: string;
  precificacao: number;
}

export interface Servico {
  id: number;
  nomeNegocio: string;
  descricao: string;
  imagem?: string | null;
  imagemUrl?: string | null;
  preco: any[];
  portfolio?: any[];
  // Se tiveres um disponivel aqui fora, podes manter, 
  // mas o erro indica que ele falta lá dentro do usuario:
  categoria?: {
    id: number;
    nomeServico: string;
  };
  usuario?: {
    id: number;
    telefone: string;
    nome?: string;
    // ✨ ADICIONA ESTA LINHA AQUI:
    disponivel?: boolean; 
  };
}

/** Item de preço para criação/atualização */
export interface PrecoInput {
  nomeservico: string;
  precificacao: number;
}

/** Payload de criação */
export interface CreateServicoPayload {
  nomeNegocio: string;
  descricao: string;
  categoriaId: number;
  preco: PrecoInput[];
}

/** Payload de atualização (parcial) */
export type UpdateServicoPayload = Partial<{
  nomeNegocio: string;
  descricao: string;
  categoriaId: number;
  preco: PrecoInput[];
}>;