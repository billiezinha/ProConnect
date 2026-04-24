import type { Metadata } from "next";
import ClientProviders from "@/components/ClientProviders/ClientProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProConnect | Encontre Profissionais e Serviços",
  description: "Simplifique a busca por serviços e profissionais com a plataforma mais direta e transparente do mercado.",
  keywords: "profissionais, serviços, freelancers, proconnect, contratação",
  openGraph: {
    title: "ProConnect | Encontre Profissionais e Serviços",
    description: "Simplifique a busca por serviços e profissionais com a plataforma mais direta e transparente do mercado.",
    type: "website",
    locale: "pt_BR",
    siteName: "ProConnect"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        
        {/* SCRIPT QUE EVITA A TELA PISCAR BRANCO NO MODO ESCURO */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem("@ProConnect:theme");
                  if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
                    document.documentElement.setAttribute("data-theme", "dark");
                  } else {
                    document.documentElement.setAttribute("data-theme", "light");
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}