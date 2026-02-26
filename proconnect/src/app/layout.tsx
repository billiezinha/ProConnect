"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/navbar/Navbar";
import SplashScreen from "@/components/SplashScreen/SplashScreen";
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
    <html lang="pt-BR">
      <head>
        {/* ESTA É A LINHA MÁGICA QUE AVISA O TELEMÓVEL PARA USAR O MODO RESPONSIVO */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <title>ProConnect</title>
      </head>
      <body>
        <ThemeProvider>
          <SplashScreen isVisible={showSplash} />

          {!showSplash && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 0.8 }}
            >
              <Toaster position="top-right" reverseOrder={false} />
              
              <Navbar /> 

              <main>{children}</main>
            </motion.div>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}