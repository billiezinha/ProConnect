// ===================================================================
//  INTERFACES PARA DADOS RECEBIDOS DA API (O que o backend envia)
// ===================================================================
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
  // ... outras propriedades que a API retorna
}

// ===================================================================
//  INTERFACES PARA DADOS ENVIADOS PARA A API (O que o frontend envia)
// ===================================================================
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
  imagem: string | null; // A imagem é enviada como base64
}