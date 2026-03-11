import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Tenta pegar o token dos cookies (essencial para o lado do servidor)
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 2. Define as rotas que precisam de proteção
  const protectedRoutes = ['/perfil', '/editar', '/meus-servicos', '/cadastro-servico'];
  
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // 3. Lógica de Redirecionamento:
  // Se for rota protegida e NÃO tiver o cookie, manda para o login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    // Adiciona o parâmetro 'from' para saber de onde o usuário veio (opcional/IHC)
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se o usuário JÁ está logado e tenta ir para o login ou cadastro, manda para o perfil
  if ((pathname === '/login' || pathname === '/cadastro-usuario') && token) {
    return NextResponse.redirect(new URL('/perfil', request.url));
  }

  return NextResponse.next();
}

// Configura o matcher de forma eficiente
export const config = {
  matcher: [
    '/perfil/:path*', 
    '/editar/:path*', 
    '/meus-servicos/:path*', 
    '/cadastro-servico/:path*',
    '/login',
    '/cadastro-usuario'
  ],
};