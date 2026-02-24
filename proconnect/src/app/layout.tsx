"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast"; // 1. Importação correta do Toaster
import Navbar from "@/components/navbar/Navbar";
import SplashScreen from "@/components/SplashScreen/SplashScreen";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const pathname = usePathname();

  // A Splash Screen geralmente aparece apenas na Home ou na primeira carga
  const isHome = pathname === "/";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="pt-BR">
      <body>
        {/* SplashScreen recebe a prop isVisible para controlar o efeito de saída */}
        <SplashScreen isVisible={showSplash} />

        {/* 2. O conteúdo principal só renderiza/anima quando a Splash termina */}
        {!showSplash && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.8 }}
          >
            {/* 3. Toaster deve ficar no topo para estar disponível em todo o app */}
            <Toaster position="top-right" reverseOrder={false} />
            
            {/* 4. Navbar fixa no topo */}
            <Navbar /> 

            {/* 5. As páginas do sistema (Home, Busca, etc) */}
            <main>{children}</main>
          </motion.div>
        )}
      </body>
    </html>
  );
}