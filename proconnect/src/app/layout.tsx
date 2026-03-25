"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer"; // 1. Importação do novo Footer
import SplashScreen from "@/components/SplashScreen/SplashScreen";
import FloatingChat from "@/components/FloatingChat/FloatingChat";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <title>ProConnect</title>
        
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
        <ThemeProvider>
          <SplashScreen isVisible={showSplash} />

          {!showSplash && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 0.8 }}
              style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
            >
              <Toaster position="top-right" reverseOrder={false} />
              
              <Navbar /> 

              {/* flex: 1 garante que o footer fique no fim da página mesmo com pouco conteúdo */}
              <main style={{ flex: 1 }}>{children}</main>

              <Footer /> {/* 2. Footer adicionado aqui */}
              
              <FloatingChat />
            </motion.div>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}