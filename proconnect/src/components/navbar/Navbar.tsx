"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isLogged, setIsLogged] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Verifica se há um token sempre que a rota mudar ou o componente montar
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    router.replace("/login");
  };

  // Se estivermos na página de login ou cadastro, talvez você queira esconder a Navbar
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