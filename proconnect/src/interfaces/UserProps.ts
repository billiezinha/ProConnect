// Para enviar dados para criar um usuário
export interface CreateUserPayload {
  nome: string;
  email: string;
  telefone?: string;
  estado?: string;
  cidade?: string;
  endereco?: string;
  senha: string;
}

// Para atualizar (parcial ou total) — aqui incluí email porque sua tela permite editar
export interface UpdateUserPayload {
  nome?: string;
  email?: string;
  telefone?: string;
  estado?: string;
  cidade?: string;
  endereco?: string;
}

// Para receber dados do usuário da API (sem senha)
export interface User {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  estado?: string;
  cidade?: string;
  endereco?: string;
}

// Token pode trazer userId como string/number, ou até em "sub"
export interface DecodedToken {
  userId?: number | string;
  sub?: string | number;
}
