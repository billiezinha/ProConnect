"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { FaUsers, FaChartBar, FaLock, FaBan, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { getMe } from "@/service/userService";
import type { User } from "@/interfaces/UserProps";
import { LoadingProfile } from "@/components/loading/Loading";

// ✨ COLOQUE AQUI O SEU EMAIL (OU EMAILS) QUE TERÁ ACESSO AO PAINEL DE ADMIN:
const ADMIN_EMAILS = [
  "joao@exemplo.com", 
  "leticia@exemplo.com",
  // Adicione seu email real abaixo:
  "leticia", "joao" // temporário pra não te bloquear
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    async function checkAdmin() {
      try {
        const userData = await getMe();
        
        // Verifica se o email do usuário está na lista de admins ou se possui "admin" no email
        const isAdmin = ADMIN_EMAILS.some(email => userData.email.includes(email)) || userData.email.includes('admin');
        
        if (!isAdmin) {
          router.replace("/perfil"); // Expulsa quem não é admin
          return;
        }

        setUser(userData);
      } catch (error) {
        console.error("Erro ao verificar admin", error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }
    checkAdmin();
  }, [router]);

  if (loading) {
    return <LoadingProfile />;
  }

  if (!user) return null; // Será redirecionado

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <h2>ProConnect <span>Admin</span></h2>
        </div>
        <nav className={styles.nav}>
          <button 
            className={activeTab === "overview" ? styles.activeTab : ""}
            onClick={() => setActiveTab("overview")}
          >
            <FaChartBar /> Visão Geral
          </button>
          <button 
            className={activeTab === "users" ? styles.activeTab : ""}
            onClick={() => setActiveTab("users")}
          >
            <FaUsers /> Usuários
          </button>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Painel de Controle</h1>
          <div className={styles.adminInfo}>
            <FaLock color="#4CAF50" />
            <span>Acesso Restrito: {user.nome}</span>
          </div>
        </header>

        {activeTab === "overview" && (
          <section className={styles.contentSection}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h3>Total de Usuários</h3>
                <p className={styles.statValue}>1.240</p>
                <span className={styles.statVarPositive}>+12% este mês</span>
              </div>
              <div className={styles.statCard}>
                <h3>Profissionais Ativos</h3>
                <p className={styles.statValue}>450</p>
                <span className={styles.statVarPositive}>+5% este mês</span>
              </div>
              <div className={styles.statCard}>
                <h3>Serviços Realizados</h3>
                <p className={styles.statValue}>3.890</p>
              </div>
              <div className={styles.statCard}>
                <h3>Assinantes Premium</h3>
                <p className={styles.statValue}>85</p>
              </div>
            </div>

            <div className={styles.alertBox}>
              <h3><FaExclamationTriangle color="#ff9800" /> Avisos do Sistema</h3>
              <p>Funcionalidade em desenvolvimento. As métricas acima são de demonstração. Conecte com os endpoints reais do backend de Admin.</p>
            </div>
          </section>
        )}

        {activeTab === "users" && (
          <section className={styles.contentSection}>
            <h2>Gerenciamento de Usuários</h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mock data for now */}
                  <tr>
                    <td>João Silva</td>
                    <td>joao@exemplo.com</td>
                    <td><span className={styles.statusActive}><FaCheckCircle/> Ativo</span></td>
                    <td>
                      <button className={styles.actionBtn}><FaBan /> Banir</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Maria Souza</td>
                    <td>maria@exemplo.com</td>
                    <td><span className={styles.statusActive}><FaCheckCircle/> Ativo</span></td>
                    <td>
                      <button className={styles.actionBtn}><FaBan /> Banir</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
