"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getServicos } from "@/service/servicoService";
import { Servico } from "@/interfaces/ServicoProps";
import styles from "./page.module.css";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import Modal from "@/components/Modal";

export default function BuscaProfissionaisPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const data = await getServicos();
        setServicos(data);
      } catch {
        setError("Não foi possível carregar os serviços. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchServicos();
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [showModal]);

  const openModal = (id: number) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedId(null);
  };

  const norm = (s?: string) =>
    (s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filteredServicos = useMemo(() => {
    if (!searchTerm) return servicos;
    const t = norm(searchTerm);
    return servicos.filter((servico) => 
      norm(servico.nomeNegocio).includes(t) ||
      norm(servico.descricao).includes(t) ||
      norm(servico.categoria?.nomeServico).includes(t) ||
      norm(servico.usuario?.nome).includes(t)
    );
  }, [searchTerm, servicos]);

  return (
    <div className={styles.body}>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <Link href="/">ProConnect</Link>
          </div>
          <div className={styles.profileLink}>
            <Link href="/perfil">
              <FaUserCircle />
              <span>Meu Perfil</span>
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.searchSection}>
            <h1 className={styles.title}>Encontre o profissional certo</h1>
            <p className={styles.subtitle}>
              Busque por serviço, categoria ou nome do profissional.
            </p>
            <div className={styles.searchBar}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Digite sua busca aqui..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          {loading && <p className={styles.loadingState}>Carregando serviços...</p>}
          {error && <p className={styles.errorState}>{error}</p>}

          {!loading && !error && (
            <div className={styles.resultsGrid}>
              {filteredServicos.length > 0 ? (
                filteredServicos.map((servico) => (
                  <div key={servico.id} className={styles.servicoCard}>
                    <div className={styles.cardContent}>
                      <h3 className={styles.servicoTitle}>{servico.nomeNegocio}</h3>
                      <p className={styles.servicoProvider}>
                        {servico.usuario?.nome || "Profissional"}
                      </p>
                      <p className={styles.servicoDescription}>{servico.descricao}</p>
                    </div>
                    <div className={styles.cardFooter}>
                      <span className={styles.servicoCategory}>
                        {servico.categoria?.nomeServico || "Sem Categoria"}
                      </span>
                      {/* BOTÃO ADICIONADO AQUI */}
                      <button
                        type="button"
                        className={styles.detailsButton}
                        onClick={() => openModal(servico.id)}
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.emptyState}>Nenhum serviço encontrado.</p>
              )}
            </div>
          )}
        </div>
      </main>

      {showModal && selectedId !== null && (
        <Modal id={selectedId} onClose={closeModal} />
      )}
    </div>
  );
}