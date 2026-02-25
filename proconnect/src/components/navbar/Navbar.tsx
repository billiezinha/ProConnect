"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FaUserCircle, FaSignOutAlt, FaHeart, FaSun, FaMoon, FaBullseye } from "react-icons/fa"; 
import styles from "./Navbar.module.css";
import Cookies from "js-cookie";
import { useTheme } from "@/context/ThemeContext"; // Importação do Hook de Tema

export default function Navbar() {
  const [isLogged, setIsLogged] = useState(false);
  const { isDark, toggleTheme } = useTheme(); // Usando o tema
  const [favCount, setFavCount] = useState(0); // Contador de favoritos
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);

    // Atualiza o contador de favoritos do localStorage
    const salvos = JSON.parse(localStorage.getItem("@ProConnect:favoritos") || "[]");
    setFavCount(salvos.length);
  }, [pathname]);

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
            Explorar
          </Link>

          <Link href="/favoritos" className={styles.navLink}>
            <div className={styles.favBadgeWrapper}>
              <FaHeart style={{ marginRight: '5px', fontSize: '0.9rem' }} />
              {favCount > 0 && <span className={styles.badge}>{favCount}</span>}
            </div>
            Favoritos
          </Link>

          {/* BOTÃO MODO DARK: Colocado estrategicamente antes do Login/Perfil */}
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
                <FaUserCircle />
                <span>Meu Perfil</span>
              </Link>
              <button onClick={handleLogout} className={styles.logoutBtn} aria-label="Sair">
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <Link href="/login" className={styles.loginBtn}>
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}