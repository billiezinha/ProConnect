import { Categoria } from "./CategoriaProps";
import { User } from "./UserProps";

// Dados RECEBIDOS da API
export interface PrecoItem {
  id: number;
  nomeservico: string;
  precificacao: number;
}

export interface Servico {
  id: number;
  nomeNegocio: string;
  descricao: string;
  imagemUrl?: string;
  preco: PrecoItem[];
  // Linhas adicionadas para corrigir o erro
  categoria: Categoria;
  usuario: User;
}

// Dados ENVIADOS para a API
export interface PrecoInput {
  nomeservico: string;
  precificacao: number;
}

export interface CreateServicoPayload {
  nomeNegocio: string;
  descricao: string;
  preco: PrecoInput[];
  categoriaId: number;
  usuarioId: number;
  imagem: string | null;
}