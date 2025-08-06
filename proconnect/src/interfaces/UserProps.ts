/**
 * Estrutura de dados para criar um novo utilizador.
 * Contém a senha.
 */
export interface CreateUserPayload {
  nome: string;
  email: string;
  telefone?: string;
  estado?: string;
  cidade?: string;
  endereco?: string;
  senha: string;
}

/**
 * Representa um utilizador como ele vem da API.
 * NUNCA deve conter a senha.
 */
export interface User {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  estado?: string;
  cidade?: string;
  endereco?: string;
}