"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

import pageStyles from "./page.module.css";
import modalStyles from "@/components/modal-editar/page.module.css";

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
      message:
        e.response?.data?.message ||
        e.response?.data?.error ||
        (e as { message?: string }).message ||
        "Falha ao executar a ação.",
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

  // Necessário para portal só montar no client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Fechar com ESC e travar scroll do body enquanto o modal estiver aberto
  useEffect(() => {
    if (!isModalOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseModal();
    };
    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isModalOpen]);

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
      setServicos((prev) => prev.filter((s) => s.id !== id));
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
      setServicos((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      handleCloseModal();
    } catch (err: unknown) {
      const { message } = parseHttpError(err);
      setError(`Erro ao salvar: ${message}`);
    }
  };

  // UI do modal via portal (usa os estilos do arquivo do modal)
  const modalUI =
    mounted && isModalOpen
      ? createPortal(
          <div
            className={modalStyles.overlay /* ajuste para sua classe de overlay */}
            role="dialog"
            aria-modal="true"
          >
            {/* Opcional: backdrop clicável para fechar */}
            <div
              className={modalStyles.backdrop /* ajuste */}
              onClick={handleCloseModal}
              aria-hidden="true"
            />
            <div className={modalStyles.modal /* ajuste */}>
              <div className={modalStyles.modalContent /* ajuste */}>
                <button
                  type="button"
                  className={modalStyles.closeBtn /* ajuste */}
                  onClick={handleCloseModal}
                  aria-label="Fechar modal"
                >
                  ×
                </button>

                <EditServicoModal
                  servico={editingServico}
                  onClose={handleCloseModal}
                  onSave={handleSaveChanges}
                />
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div className={pageStyles.body}>
        <header className={pageStyles.header}>
          <div className={pageStyles.container}>
            <Link href="/perfil" className={pageStyles.backLink}>
              &larr; Voltar ao Perfil
            </Link>
            <h1 className={pageStyles.headerTitle}>Meus Serviços</h1>
            <Link href="/cadastro-servico" className={pageStyles.addButton}>
              <FaPlus /> Adicionar Novo
            </Link>
          </div>
        </header>

        <main className={pageStyles.mainContent}>
          <div className={pageStyles.container}>
            {loading && <p>Carregando serviços...</p>}
            {error && <p className={pageStyles.error}>{error}</p>}

            {!loading && !error && (
              <div className={pageStyles.grid}>
                {servicos.length > 0 ? (
                  servicos.map((servico) => (
                    <div key={servico.id} className={pageStyles.card}>
                      <div className={pageStyles.cardHeader}>
                        <h2 className={pageStyles.cardTitle}>{servico.nomeNegocio}</h2>
                        <span className={pageStyles.cardCategory}>
                          {servico.categoria?.nomeServico ?? "Sem categoria"}
                        </span>
                      </div>

                      <p className={pageStyles.cardDescription}>{servico.descricao}</p>

                      <div className={pageStyles.cardFooter}>
                        <button
                          type="button"
                          className={pageStyles.actionButton}
                          onClick={() => handleOpenEditModal(servico)}
                        >
                          <FaEdit /> Editar
                        </button>
                        <button
                          type="button"
                          className={`${pageStyles.actionButton} ${pageStyles.deleteButton}`}
                          onClick={() => handleDelete(servico.id)}
                        >
                          <FaTrash /> Excluir
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={pageStyles.noResults}>
                    <h3>Nenhum serviço cadastrado.</h3>
                    <p>Que tal adicionar seu primeiro serviço agora?</p>
                    <Link href="/cadastro-servico" className={pageStyles.addButton}>
                      <FaPlus /> Adicionar Serviço
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal com estilos importados do CSS do modal */}
      {modalUI}
    </>
  );
}
