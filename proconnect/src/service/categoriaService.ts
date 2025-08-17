import api from "./api";
import { Categoria } from "@/interfaces/CategoriaProps";

export async function getCategorias(): Promise<Categoria[]> {
  const { data } = await api.get<Categoria[]>("/categoria");
  return data;
}

export async function getCategoriaNome(id: number): Promise<string> {
  const { data } = await api.get<Categoria>(`/categoria/${id}`);
  return data.nomeServico;
}

export default { getCategorias, getCategoriaNome };
