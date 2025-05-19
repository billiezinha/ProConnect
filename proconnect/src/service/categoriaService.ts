import { Categoria } from "@/interfaces/CategoriaProps";
import api from "./api";

export async function getCategorias(): Promise<Categoria[]> {
  const resp = await api.get<Categoria[]>("/categoria");
  return resp.data;
}

export async function getCategoriaNome(id: number): Promise<string> {
  const resp = await api.get<Categoria>(`/categoria/${id}`);
  return resp.data.nomeServico;
}

export default { getCategorias, getCategoriaNome };
