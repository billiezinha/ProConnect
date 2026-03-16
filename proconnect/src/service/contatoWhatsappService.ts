import api from "./api";

// Adapte essas propriedades caso seu Prisma retorne nomes diferentes
export interface ContatoWhatsappProps {
  id: number;
  servicoId: number;
  usuarioClienteId: number;
  usuarioProfissionalId: number;
  status: string; // Ex: "PENDENTE", "RESPONDIDO"
  criadoEm: string;
}

export async function registrarContato(servicoId: number, mensagem?: string): Promise<ContatoWhatsappProps> {
  const { data } = await api.post<ContatoWhatsappProps>("/contato-whatsapp", { servicoId, mensagem });
  return data;
}

export async function buscarPendentesWhatsapp(): Promise<ContatoWhatsappProps[]> {
  const { data } = await api.get<ContatoWhatsappProps[]>("/contato-whatsapp/pendentes");
  return data;
}

export async function buscarMeusPedidosWhatsapp(): Promise<ContatoWhatsappProps[]> {
  const { data } = await api.get<ContatoWhatsappProps[]>("/contato-whatsapp/meus-pedidos");
  return data;
}