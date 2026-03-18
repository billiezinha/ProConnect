import api from "./api";

// Interface que define o formato dos dados devolvidos pelo backend
export interface FavoritoProps {
  id: number;
  servicoId: number;
  usuarioId: number;
}

// 1. Adiciona um serviço aos favoritos
export async function adicionarFavorito(servicoId: number): Promise<FavoritoProps> {
  const { data } = await api.post<FavoritoProps>("/favorito", { servicoId });
  return data;
}

// 2. Remove um serviço dos favoritos
export async function removerFavorito(servicoId: number): Promise<void> {
  await api.delete(`/favorito/${servicoId}`);
}

// 3. Lista os objetos completos dos favoritos
export async function listarFavoritos(): Promise<FavoritoProps[]> {
  const { data } = await api.get<FavoritoProps[]>("/favorito");
  return data;
}

// 4. Busca APENAS um array com os IDs dos serviços (perfeito para verificar se o coração fica vermelho)
// 4. Busca APENAS um array com os IDs dos serviços
export const getFavoritosIds = async (): Promise<number[]> => {
  try {
    const data = await listarFavoritos(); 
    return data.map((fav) => fav.servicoId);
  } catch (error: any) {
    // Se o backend avisar que não estamos autorizados ou o token for inválido/expirado
    const isTokenError = 
      error.response?.status === 401 || 
      error.response?.status === 403 ||
      error.message?.includes("Token") ||
      error.response?.data?.message?.includes("Token");

    if (isTokenError) {
      console.warn("Token expirado. A limpar sessão...");
      localStorage.removeItem("token"); // Remove o token inválido para parar de dar erro
      // Se usares Cookies para o token, podes adicionar: Cookies.remove("token");
    } else {
      console.error("Erro ao buscar IDs dos favoritos", error);
    }
    
    return []; // Devolve array vazio para não quebrar a tela de Busca
  }
};