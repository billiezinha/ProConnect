export interface PrecoItem {
  id: number;
  nomeservico: string;
  precificacao: number;
}

export interface Localizacao {
  id: number;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface Categoria {
  id: number;
  nomeServico: string;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
}

export interface Servico {
  id: number;
  nomeNegocio: string;
  descricao: string;
  categoriaId: number;
  usuarioId: number;
  localizacao?: Localizacao;
  preco: PrecoItem[];
  categoria: Categoria;
  usuario: Usuario;
}
