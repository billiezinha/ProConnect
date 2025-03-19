import api from "./api";

export interface Categoria {
  id: number;
  nomeServico: string;
}

const getCategoriaNome = async (id: number): Promise<string> => {
  try {
    const response = await api.get<Categoria>(`/categoria/${id}`);
    return response.data.nomeServico;
  } catch (error) {
    console.error("Erro ao buscar categoria:", error);
    throw error;
  }
};

const categoriaService = {
  getCategoriaNome,
};

export default categoriaService;
