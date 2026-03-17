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

/** Estrutura principal retornada pela API */
export interface Servico {
  id: number;
  nomeNegocio: string;
  descricao: string;
  imagemUrl?: string | null; // Foto principal (capa)
  preco: PrecoItem[];
  portfolio?: PortfolioItem[]; // ✨ Adicionado: Fotos do portfólio
  categoria?: Categoria; 
  usuario?: User;        
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