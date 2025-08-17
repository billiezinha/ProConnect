"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getMeusServicos } from "@/service/servicoService";
import { Servico } from "@/interfaces/ServicoProps";
import styles from "./page.module.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function MeusServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const data = await getMeusServicos();
        setServicos(data);
      } catch (err: any) {
        setError(err.message || "Falha ao carregar seus serviços.");
        if (err.message.includes("autenticado")) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServicos();
  }, [router]);

  return (
    <div className={styles.body}>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/perfil" className={styles.backLink}>
            &larr; Voltar ao Perfil
          </Link>
          <h1 className={styles.headerTitle}>Meus Serviços</h1>
          <Link href="/cadastro-servico" className={styles.addButton}>
            <FaPlus /> Adicionar Novo
          </Link>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.container}>
          {loading && <p>Carregando serviços...</p>}
          {error && <p className={styles.error}>{error}</p>}
          {!loading && !error && (
            <div className={styles.grid}>
              {servicos.length > 0 ? (
                servicos.map((servico) => (
                  <div key={servico.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h2 className={styles.cardTitle}>{servico.nomeNegocio}</h2>
                      <span className={styles.cardCategory}>
                        {servico.categoria?.nomeServico ?? "Sem categoria"}
                      </span>
                    </div>
                    <p className={styles.cardDescription}>{servico.descricao}</p>
                    <div className={styles.cardFooter}>
                      <button className={styles.actionButton}><FaEdit /> Editar</button>
                      <button className={`${styles.actionButton} ${styles.deleteButton}`}><FaTrash /> Excluir</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noResults}>
                  <h3>Nenhum serviço cadastrado.</h3>
                  <p>Que tal adicionar seu primeiro serviço agora?</p>
                  <Link href="/cadastro-servico" className={styles.addButton}>
                    <FaPlus /> Adicionar Serviço
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}