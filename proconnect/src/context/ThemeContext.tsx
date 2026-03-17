"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // 1. Função para ler a cor do sistema (Windows, macOS, iOS, Android)
    const getSystemTheme = (): Theme => {
      if (typeof window !== "undefined" && window.matchMedia) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      return "light"; // Padrão caso o navegador não suporte
    };

    // 2. Aplica o tema assim que a página carrega
    const initialTheme = getSystemTheme();
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);

    // 3. Ouve mudanças no sistema em TEMPO REAL
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? "dark" : "light";
      setTheme(newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    };

    // Adiciona o "espião" para detetar quando o utilizador muda a cor no telemóvel
    mediaQuery.addEventListener("change", handleChange);

    // Limpa a memória quando o utilizador sai do site
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Nota: Já não precisamos de exportar uma função "toggleTheme", 
  // porque agora tudo é automático!
  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  return context;
}