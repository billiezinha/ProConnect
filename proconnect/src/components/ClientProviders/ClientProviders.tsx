"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import SplashScreen from "@/components/SplashScreen/SplashScreen";
import FloatingChat from "@/components/FloatingChat/FloatingChat";
import { ThemeProvider } from "@/context/ThemeContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); 
    return () => clearTimeout(timer);
  }, []);

  return (
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
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
          <FloatingChat />
        </motion.div>
      )}
    </ThemeProvider>
  );
}
