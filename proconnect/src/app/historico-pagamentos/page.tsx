"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaFileInvoiceDollar, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import styles from "./page.module.css";
import { getMe } from "@/service/userService";
import { LoadingProfile } from "@/components/loading/Loading";

export default function HistoricoPagamentosPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        await getMe();
        // Em um cenário real, aqui seria feita a chamada para buscar o histórico da API.
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  if (loading) return <LoadingProfile />;

  // Dados mockados para exibição inicial até a API ser integrada
  const pagamentos = [
    { id: 1, data: "28/04/2026", plano: "Plano Pro", valor: "R$ 49,90", status: "aprovado" },
    { id: 2, data: "28/03/2026", plano: "Plano Pro", valor: "R$ 49,90", status: "aprovado" },
    { id: 3, data: "28/02/2026", plano: "Plano Pro", valor: "R$ 49,90", status: "recusado" },
    { id: 4, data: "29/02/2026", plano: "Plano Pro", valor: "R$ 49,90", status: "aprovado" },
  ];

  const renderStatus = (status: string) => {
    switch (status) {
      case "aprovado": return <span className={styles.statusBadge} style={{ color: '#4CAF50', backgroundColor: 'rgba(76, 175, 80, 0.1)' }}><FaCheckCircle/> Aprovado</span>;
      case "recusado": return <span className={styles.statusBadge} style={{ color: '#F44336', backgroundColor: 'rgba(244, 67, 54, 0.1)' }}><FaTimesCircle/> Recusado</span>;
      case "pendente": return <span className={styles.statusBadge} style={{ color: '#FFC107', backgroundColor: 'rgba(255, 193, 7, 0.1)' }}><FaClock/> Pendente</span>;
      default: return null;
    }
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push("/perfil")}>
          <FaArrowLeft /> Voltar
        </button>
        <h1><FaFileInvoiceDollar /> Histórico de Pagamentos</h1>
      </header>
      
      <main className={styles.content}>
        <div className={styles.card}>
          {pagamentos.length > 0 ? (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Descrição</th>
                    <th>Valor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pagamentos.map(pag => (
                    <tr key={pag.id}>
                      <td>{pag.data}</td>
                      <td>{pag.plano}</td>
                      <td>{pag.valor}</td>
                      <td>{renderStatus(pag.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={styles.emptyText}>Você ainda não possui pagamentos registrados.</p>
          )}
        </div>
      </main>
    </div>
  );
}
