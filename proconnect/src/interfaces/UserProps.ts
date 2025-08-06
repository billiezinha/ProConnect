// Para enviar dados para criar um utilizador
export interface CreateUserPayload {
  nome: string;
  email: string;
  telefone?: string;
  estado?: string;
  cidade?: string;
  endereco?: string;
  senha: string;
}

// Para receber dados de um utilizador da API (sem a senha!)
export interface User {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  estado?: string;
  cidade?: string;
  endereco?: string;
}