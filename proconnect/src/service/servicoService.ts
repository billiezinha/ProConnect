import api from "./api";

export interface ServicoData {
  nomeNegocio: string;
  preco: Array<{ 
    id?: number;
    nomeservico: string; 
    precificacao: number; 
    servicoId?: number;
  }>;
  avaliacao: Array<{ 
    id?: number;
    star: number; 
    descricao: string; 
    usuarioId: number;
  }>;
  descricao: string;
  categoriaid: number;
  usuarioId: number;
}

const createServico = async (data: ServicoData) => {
  try {
    const response = await api.post("/servicos", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar serviço:", error);
    throw error;
  }
};

const servicoService = {
  createServico
};

export default servicoService;
