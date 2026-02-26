"use client";
import { useState, useEffect } from "react";
import { getServicos } from "@/service/servicoService";
import { Servico } from "@/interfaces/ServicoProps";
import styles from "../Busca-profissionais/page.module.css";
import Modal from "@/components/Modal";
import { LoadingGrid } from "@/components/loading/Loading";
import { FaHeart } from "react-icons/fa";

export default function FavoritosPage() {
  const [servicosFavoritos, setServicosFavoritos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const carregarFavoritos = async () => {
      try {
        // 1. Busca os IDs salvos no localStorage
        const salvos = localStorage.getItem("@ProConnect:favoritos");
        const idsFavoritos = salvos ? JSON.parse(salvos) : [];

        if (idsFavoritos.length > 0) {
          // 2. Busca todos os serviços da API
          const todos = await getServicos();
          // 3. Filtra apenas os que o usuário favoritou
          const filtrados = todos.filter((s: Servico) => idsFavoritos.includes(s.id));
          setServicosFavoritos(filtrados);
        }
      } catch (error) {
        console.error("Erro ao carregar favoritos", error);
      } finally {
        setLoading(false);
      }
    };

    carregarFavoritos();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingGrid />
      </div>
    );
  }

  return (
    <div className={styles.body}>
      <main className={styles.container}>
        <div className={styles.searchSection}>
          <h1 className={styles.title}>
            <FaHeart style={{ color: 'var(--cor-primaria)', marginRight: '10px' }} />
            Meus Profissionais Salvos
          </h1>
          <p className={styles.subtitle}>
            Consulte aqui os profissionais que guardou para contato posterior.
          </p>
        </div>

        <div className={styles.resultsGrid}>
          {servicosFavoritos.length > 0 ? (
            servicosFavoritos.map((s) => (
              <div key={s.id} className={styles.servicoCard}>
                <div className={styles.cardContent}>
                  <h3 className={styles.servicoTitle}>{s.nomeNegocio}</h3>
                  <p className={styles.servicoDescription}>{s.descricao}</p>
                </div>
                <div className={styles.cardFooter}>
                  <button 
                    className={styles.detailsButton}
                    onClick={() => { 
                      setSelectedId(s.id); 
                      setShowModal(true); 
                    }}
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.emptyState}>Ainda não guardou nenhum favorito.</p>
          )}
        </div>
      </main>

      {/* CORREÇÃO DO ERRO DE TIPAGEM */}
      {showModal && selectedId && (
        <Modal 
          profissional={{ id: selectedId }} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
}