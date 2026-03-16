import api from "./api";

// Interface que define o formato dos dados devolvidos pelo backend
export interface FavoritoProps {
  id: number;
  servicoId: number;
  usuarioId: number;
}

export async function adicionarFavorito(servicoId: number): Promise<FavoritoProps> {
  const { data } = await api.post<FavoritoProps>("/favorito", { servicoId });
  return data;
}

export async function removerFavorito(servicoId: number): Promise<void> {
  // Chamamos a API para deletar, mas não retornamos os dados
  await api.delete(`/favorito/${servicoId}`);
}

export async function listarFavoritos(): Promise<FavoritoProps[]> {
  const { data } = await api.get<FavoritoProps[]>("/favorito");
  return data;
}