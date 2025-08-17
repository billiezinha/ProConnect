"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMe } from "@/service/userService";
import { getServicos, deleteServico, updateServico } from "@/service/servicoService";
import type { Servico, UpdateServicoPayload } from "@/interfaces/ServicoProps";
import styles from "./page.module.css";
import EditServicoModal from "@/components/modal-editar/EditServicoModal";
import { FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";

export default function MeusServicosPage() {
  const router = useRouter();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServico, setSelectedServico] = useState<Servico | null>(null);

  useEffect(() => {
    const fetchMeusServicos = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const currentUser = await getMe();
        const todosServicos = await getServicos();

        const meusServicos = todosServicos.filter(
          (servico) => servico.usuario?.id === currentUser.id
        );
        
        setServicos(meusServicos);
      } catch { // 'err' removido daqui
        setError("Não foi possível carregar os serviços. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeusServicos();
  }, [router]);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este serviço?");
    if (confirmDelete) {
      try {
        await deleteServico(id);
        setServicos(servicos.filter((s: Servico) => s.id !== id));
      } catch { // 'err' removido daqui
        setError("Falha ao excluir o serviço. Tente novamente.");
      }
    }
  };

  const openModal = (servico: Servico) => {
    setSelectedServico(servico);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedServico(null);
  };

  const handleSave = async (data: UpdateServicoPayload) => {
    if (!selectedServico) return;

    try {
      const updatedServico = await updateServico(selectedServico.id, data);
      setServicos(
        servicos.map((s: Servico) => (s.id === updatedServico.id ? updatedServico : s)),
      );
      closeModal();
    } catch { // 'err' removido daqui
      setError("Falha ao atualizar o serviço.");
    }
  };

  if (loading) {
    return <div className={styles.loadingState}>Carregando seus serviços...</div>;
  }

  return (
    <div className={styles.body}>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/perfil" className={styles.backButton}>
            <FaArrowLeft />
          </Link>
          <h1 className={styles.headerTitle}>Meus Serviços</h1>
          <Link href="/cadastro-servico" className={styles.newServiceButton}>
            Novo Serviço
          </Link>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.container}>
          {error && <p className={styles.errorState}>{error}</p>}
          {servicos.length > 0 ? (
            <div className={styles.servicosGrid}>
              {servicos.map((servico: Servico) => (
                <div key={servico.id} className={styles.servicoCard}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.servicoTitle}>{servico.nomeNegocio}</h2>
                    <div className={styles.cardActions}>
                      <button
                        onClick={() => openModal(servico)}
                        className={`${styles.actionButton} ${styles.editButton}`}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(servico.id)}
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <p className={styles.servicoDescription}>{servico.descricao}</p>
                  <div className={styles.servicoFooter}>
                    <span className={styles.servicoCategory}>
                      {servico.categoria ? servico.categoria.nomeServico : "Sem categoria"}
                    </span>
                    {servico.preco && servico.preco.length > 0 && (
                      <span className={styles.servicoPrice}>
                        R$ {servico.preco[0].precificacao.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !error && (
              <div className={styles.emptyState}>
                <h3>Nenhum serviço anunciado</h3>
                <p>Parece que você ainda não cadastrou nenhum serviço.</p>
                <Link href="/cadastro-servico" className={styles.newServiceButtonEmpty}>
                  Anunciar meu primeiro serviço
                </Link>
              </div>
            )
          )}
        </div>
      </main>

      {isModalOpen && selectedServico && (
        <EditServicoModal
          servico={selectedServico}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}