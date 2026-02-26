"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ isDark: false, toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false); // Proteção contra erros do Next.js

  useEffect(() => {
    setMounted(true);
    // Verifica qual é a cor atual que o nosso script do layout (abaixo) aplicou
    const currentTheme = document.documentElement.getAttribute("data-theme");
    setIsDark(currentTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    const themeString = newTheme ? "dark" : "light";
    localStorage.setItem("@ProConnect:theme", themeString);
    document.documentElement.setAttribute("data-theme", themeString);
  };

  // Evita que o React tente renderizar o tema errado na primeira fração de segundo
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ isDark: false, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);