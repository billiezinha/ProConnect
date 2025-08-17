"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMe } from "@/service/userService";
import type { User } from "@/interfaces/UserProps";
import styles from "./page.module.css";
import { 
  FaUserCircle, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaEdit, 
  FaArrowLeft 
} from "react-icons/fa";

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    router.replace("/login");
  }, [router]);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const userData = await getMe();
        setUser(userData);
      } catch {
        localStorage.removeItem("token");
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) {
    return <div className={styles.loadingState}>Carregando seu perfil…</div>;
  }

  return (
    <div className={styles.body}>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/Busca-profissionais" className={styles.backButton}>
            <FaArrowLeft />
          </Link>
          <h1 className={styles.headerTitle}>Meu Perfil</h1>
          <button onClick={logout} className={styles.logoutButton}>
            Sair
          </button>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.container}>
          {user && (
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <FaUserCircle className={styles.profileIcon} />
                <h2 className={styles.profileName}>{user.nome}</h2>
                <Link href="../editar" className={styles.editButton}>
                  <FaEdit /> Editar Perfil
                </Link>
              </div>

              <div className={styles.profileDetails}>
                <h3 className={styles.sectionTitle}>Informações de Contato</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <FaEnvelope />
                    <span>{user.email}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <FaPhone />
                    <span>{user.telefone || "Não informado"}</span>
                  </div>
                </div>

                <h3 className={styles.sectionTitle}>Localização</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <FaMapMarkerAlt />
                    <span>
                      {`${user.cidade || "Não informada"}, ${user.estado || "Não informado"}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.actionsGrid}>
            <Link href="/meus-servicos" className={styles.actionCard}>
              <h3>Meus Serviços</h3>
              <p>Ver e gerir os seus serviços anunciados</p>
            </Link>
            <Link href="/cadastro-servico" className={styles.actionCard}>
              <h3>Anunciar Novo Serviço</h3>
              <p>Crie um novo anúncio para atrair clientes</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}