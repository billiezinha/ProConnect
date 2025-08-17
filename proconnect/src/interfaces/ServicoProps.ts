import type { Categoria } from "./CategoriaProps";
import type { User } from "./UserProps";

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
  imagemUrl?: string | null;
  preco: PrecoItem[];
  categoria?: Categoria; // pode vir opcional dependendo do endpoint
  usuario?: User;        // idem
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
