export interface CreateUserPayload {
  nome: string;
  email: string;
  telefone?: string;
  estado?: string;
  cidade?: string;
  endereco?: string;
  senha: string;
}

export interface User {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  estado?: string;
  cidade?: string;
  endereco?: string;
  senha: string;
}