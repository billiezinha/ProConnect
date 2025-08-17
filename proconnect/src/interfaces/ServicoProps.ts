import { Categoria } from "./CategoriaProps";
import { User } from "./UserProps";

export interface PrecoItem {
  id: number;
  nomeservico: string;
  precificacao: number;
}

export interface Servico {
  id: number;
  nomeNegocio: string;
  descricao: string;
  imagemUrl?: string | null;
  preco: PrecoItem[];
  categoria: Categoria;
  usuario: User;
}

export interface PrecoInput {
  nomeservico: string;
  precificacao: number;
}

export interface CreateServicoPayload {
  nomeNegocio: string;
  descricao: string;
  categoriaId: number;
  preco: PrecoInput[];
}
