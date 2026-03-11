"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/service/userService";
import type { User } from "@/interfaces/UserProps";
import styles from "./page.module.css";
import { 
  FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaEdit, FaSignOutAlt, FaBriefcase, FaPlusCircle 
} from "react-icons/fa";
import Cookies from "js-cookie";

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    Cookies.remove("token");
    router.replace("/login");
  };

  useEffect(() => {
    (async () => {
      try {
        const userData = await getMe();
        setUser(userData);
      } catch {
        handleLogout();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className={styles.loadingState}>Carregando seu painel...</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Sidebar do Perfil */}
        <aside className={styles.sidebar}>
          <div className={styles.userCore}>
            <FaUserCircle className={styles.avatar} />
            <h2>{user?.nome}</h2>
            <p className={styles.userEmail}>{user?.email}</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <FaSignOutAlt /> Sair da conta
          </button>
        </aside>

        {/* Conteúdo Principal */}
        <main className={styles.content}>
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h3><FaUserCircle /> Dados Pessoais</h3>
              <button className={styles.editBtn}><FaEdit /> Editar Perfil</button>
            </div>
            <div className={styles.infoGrid}>
              <div className={styles.infoBox}>
                <label><FaPhone /> Telefone</label>
                <span>{user?.telefone || "Não cadastrado"}</span>
              </div>
              <div className={styles.infoBox}>
                <label><FaMapMarkerAlt /> Localização</label>
                <span>{user?.cidade || "Picos"}, {user?.estado || "PI"}</span>
              </div>
            </div>
          </section>

          {/* Cards de Ação Profissional */}
          <div className={styles.quickActions}>
            <div onClick={() => router.push("/meus-servicos")} className={styles.actionCard}>
              <FaBriefcase />
              <h4>Meus Serviços</h4>
              <p>Gerencie seus anúncios em Picos.</p>
            </div>
            <div onClick={() => router.push("/cadastro-servico")} className={styles.actionCard}>
              <FaPlusCircle />
              <h4>Novo Anúncio</h4>
              <p>Atraia mais clientes agora.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}