"use column";
"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ isDark: false, toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  // 1. Ao carregar, verifica o LocalStorage ou o Sistema
  useEffect(() => {
    const savedTheme = localStorage.getItem("@ProConnect:theme");

    if (savedTheme) {
      // Se o usuário já escolheu um tema manualmente antes, respeita essa escolha
      const isDarkTheme = savedTheme === "dark";
      setIsDark(isDarkTheme);
      document.documentElement.setAttribute("data-theme", isDarkTheme ? "dark" : "light");
    } else {
      // Se nunca escolheu, puxa a configuração automática do dispositivo
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(systemPrefersDark);
      document.documentElement.setAttribute("data-theme", systemPrefersDark ? "dark" : "light");
    }
  }, []);

  // 2. Função que alterna o tema manualmente e salva a preferência
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    const themeString = newTheme ? "dark" : "light";
    localStorage.setItem("@ProConnect:theme", themeString);
    document.documentElement.setAttribute("data-theme", themeString);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);