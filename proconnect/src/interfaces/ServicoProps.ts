export interface PrecoItem {
  nomeservico: string;
  precificacao: number;
}

export interface Localizacao {
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface CreateServicoPayload {
  nomeNegocio: string;
  descricao: string;
  preco: PrecoItem[];
  categoriaId: number;
  usuarioId: number;
  localizacao?: Localizacao;
}

export interface Servico {
  id: number;
  nomeNegocio: string;
  descricao: string;
  categoriaId: number;
  usuarioId: number;
  localizacao?: Localizacao;
  preco: PrecoItem[];
}