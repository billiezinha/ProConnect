"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

import styles from "./page.module.css";
import { getMeusServicos, deleteServico, updateServico } from "@/service/servicoService";
import type { Servico, UpdateServicoPayload } from "@/interfaces/ServicoProps";
import EditServicoModal from "@/components/modal-editar/EditServicoModal";

/** Helper seguro para extrair mensagem/status sem usar `any` */
function parseHttpError(err: unknown): { message: string; status?: number } {
  if (err && typeof err === "object") {
    const e = err as {
      message?: string;
      response?: { status?: number; data?: { message?: string; error?: string } };
    };
    return {
      message: e.response?.data?.message || e.response?.data?.error || e.message || "Falha ao executar a ação.",
      status: e.response?.status,
    };
  }
  return { message: "Falha ao executar a ação." };
}

export default function MeusServicosPage() {
  const router = useRouter();

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServico, setEditingServico] = useState<Servico | null>(null);

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const data = await getMeusServicos();
        setServicos(data);
      } catch (err: unknown) {
        const { message, status } = parseHttpError(err);
        setError(message || "Falha ao carregar seus serviços.");
        if (status === 401 || status === 403 || /autenticad/i.test(message)) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchServicos();
  }, [router]);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;
    try {
      await deleteServico(id);
      setServicos(prev => prev.filter(s => s.id !== id));
    } catch (err: unknown) {
      const { message } = parseHttpError(err);
      setError(`Erro ao excluir: ${message}`);
    }
  };

  const handleOpenEditModal = (servico: Servico) => {
    setEditingServico(servico);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingServico(null);
  };

  const handleSaveChanges = async (data: UpdateServicoPayload) => {
    if (!editingServico) return;
    try {
      const updated = await updateServico(editingServico.id, data);
      setServicos(prev => prev.map(s => (s.id === updated.id ? updated : s)));
      handleCloseModal();
    } catch (err: unknown) {
      const { message } = parseHttpError(err);
      setError(`Erro ao salvar: ${message}`);
    }
  };

  return (
    <>
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
                  servicos.map(servico => (
                    <div key={servico.id} className={styles.card}>
                      <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>{servico.nomeNegocio}</h2>
                        <span className={styles.cardCategory}>
                          {servico.categoria?.nomeServico ?? "Sem categoria"}
                        </span>
                      </div>

                      <p className={styles.cardDescription}>{servico.descricao}</p>

                      <div className={styles.cardFooter}>
                        <button
                          type="button"
                          className={styles.actionButton}
                          onClick={() => handleOpenEditModal(servico)}
                        >
                          <FaEdit /> Editar
                        </button>
                        <button
                          type="button"
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDelete(servico.id)}
                        >
                          <FaTrash /> Excluir
                        </button>
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

      {isModalOpen && (
        <EditServicoModal
          servico={editingServico}
          onClose={handleCloseModal}
          onSave={handleSaveChanges}
        />
      )}
    </>
  );
}
