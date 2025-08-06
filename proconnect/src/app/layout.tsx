import type { Metadata } from "next";
import "./globals.css"; // Apenas a importação do nosso Design System

export const metadata: Metadata = {
  title: "ProConnect - Conectando Profissionais e Clientes",
  description: "A plataforma mais direta para encontrar e anunciar serviços.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}