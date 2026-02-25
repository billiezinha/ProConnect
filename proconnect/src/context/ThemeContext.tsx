"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ isDark: false, toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  // 1. Ao carregar, verifica o LocalStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("@ProConnect:theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  // 2. Função que alterna o tema
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