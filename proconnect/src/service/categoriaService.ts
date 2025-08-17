import api from "./api";
import type { Categoria } from "@/interfaces/CategoriaProps";

export async function getCategorias(): Promise<Categoria[]> {
  const { data } = await api.get<Categoria[]>("/categoria");
  return data;
}

export async function getCategoriaNome(id: number): Promise<string> {
  const { data } = await api.get<Categoria>(`/categoria/${id}`);
  return data.nomeServico;
}

// ✅ default export nomeado (evita import/no-anonymous-default-export)
const categoriaService = {
  getCategorias,
  getCategoriaNome,
};

export default categoriaService;
