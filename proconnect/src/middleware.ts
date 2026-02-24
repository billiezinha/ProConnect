import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Tenta pegar o token dos cookies (Next.js Middleware não lê LocalStorage)
  const token = request.cookies.get('token')?.value;

  // 2. Define as rotas que precisam de proteção
  const protectedRoutes = ['/perfil', '/editar', '/meus-servicos', '/cadastro-servico'];
  
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // 3. Se for rota protegida e não tiver token, redireciona para o login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configura em quais caminhos o middleware deve rodar
export const config = {
  matcher: ['/perfil/:path*', '/editar/:path*', '/meus-servicos/:path*', '/cadastro-servico/:path*'],
};