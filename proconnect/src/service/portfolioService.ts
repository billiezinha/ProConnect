import api from "./api";

// Interface para as fotos (deve bater com seu Model do Prisma)
export interface PortfolioFoto {
  id: number;
  url: string;
  servicoId: number;
  usuarioId: number;
  criadoEm: string;
}

export async function getPortfolioByServico(servicoId: number): Promise<PortfolioFoto[]> {
  // ✅ Adicionamos o tipo aqui no .get para o TypeScript aceitar o retorno
  const { data } = await api.get<PortfolioFoto[]>(`/portfolio/${servicoId}`);
  return data;
}

// Para o upload, também definimos o tipo de retorno
export async function uploadFotoPortfolio(formData: FormData): Promise<PortfolioFoto> {
  const { data } = await api.post<PortfolioFoto>("/portfolio", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteFotoPortfolio(id: number): Promise<void> {
  await api.delete(`/portfolio/${id}`);
}