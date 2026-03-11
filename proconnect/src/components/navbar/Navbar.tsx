"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  FaUserCircle, 
  FaSignOutAlt, 
  FaHeart, 
  FaSun, 
  FaMoon, 
  FaSearch, 
  FaSignInAlt 
} from "react-icons/fa"; 
import styles from "./Navbar.module.css";
import Cookies from "js-cookie";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const [isLogged, setIsLogged] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const [favCount, setFavCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  // Função memorizada para checar o estado de login
  const checkAuthState = useCallback(() => {
    const token = localStorage.getItem("token") || Cookies.get("token");
    setIsLogged(!!token);

    const salvos = JSON.parse(localStorage.getItem("@ProConnect:favoritos") || "[]");
    setFavCount(salvos.length);
  }, []);

  useEffect(() => {
    // Checa o login sempre que a rota mudar
    checkAuthState();

    // Listener para detectar mudanças no localStorage vindas de outras abas ou componentes
    window.addEventListener("storage", checkAuthState);
    
    return () => {
      window.removeEventListener("storage", checkAuthState);
    };
  }, [pathname, checkAuthState]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    Cookies.remove("token");
    setIsLogged(false);
    router.replace("/login");
  };

  const hideNavbar = ["/login", "/cadastro-usuario"].includes(pathname);
  if (hideNavbar) return null;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          ProConnect
        </Link>

        <nav className={styles.nav}>
          <Link href="/Busca-profissionais" className={styles.navLink}>
            <FaSearch className={styles.mobileOnlyIcon} />
            <span className={styles.desktopText}>Explorar</span>
          </Link>

          <Link href="/favoritos" className={styles.navLink}>
            <div className={styles.favBadgeWrapper}>
              <FaHeart className={styles.alwaysIcon} />
              {favCount > 0 && <span className={styles.badge}>{favCount}</span>}
            </div>
            <span className={styles.desktopText}>Favoritos</span>
          </Link>

          <button 
            onClick={toggleTheme} 
            className={styles.themeToggle}
            title={isDark ? "Modo Claro" : "Modo Escuro"}
          >
            {isDark ? <FaSun className={styles.sunIcon} /> : <FaMoon className={styles.moonIcon} />}
          </button>

          {isLogged ? (
            <div className={styles.userMenu}>
              <Link href="/perfil" className={styles.profileLink}>
                <FaUserCircle className={styles.alwaysIcon} />
                <span className={styles.desktopText}>Meu Perfil</span>
              </Link>
              <button onClick={handleLogout} className={styles.logoutBtn} aria-label="Sair">
                <FaSignOutAlt className={styles.alwaysIcon} />
              </button>
            </div>
          ) : (
            <Link href="/login" className={styles.loginBtn}>
              <FaSignInAlt className={styles.mobileOnlyIcon} />
              <span className={styles.desktopText}>Entrar</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}