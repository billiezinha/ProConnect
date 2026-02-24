"use client";
import { useState, useEffect, useMemo } from "react";
import { getServicos } from "@/service/servicoService";
import { Servico } from "@/interfaces/ServicoProps";
import styles from "./page.module.css";
import { FaSearch } from "react-icons/fa";
import Modal from "@/components/Modal";
import { LoadingGrid } from "@/components/loading/Loading";

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
        setError("Erro ao carregar serviços. Verifique sua conexão.");
      } finally {
        setLoading(false);
      }
    };
    fetchServicos();
  }, []);

  const filteredServicos = useMemo(() => {
    const t = searchTerm.toLowerCase();
    return servicos.filter(s => 
      s.nomeNegocio.toLowerCase().includes(t) || 
      s.descricao.toLowerCase().includes(t)
    );
  }, [searchTerm, servicos]);

  return (
    <div className={styles.body}>
      <main className={styles.container}>
        <div className={styles.searchSection}>
          <h1 className={styles.title}>Encontre o profissional certo</h1>
          <div className={styles.searchBar}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="O que você precisa hoje?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {loading ? (
          <LoadingGrid />
        ) : error ? (
          <p className={styles.errorState}>{error}</p>
        ) : (
          <div className={styles.resultsGrid}>
            {filteredServicos.map((s) => (
              <div key={s.id} className={styles.servicoCard}>
                <h3>{s.nomeNegocio}</h3>
                <p>{s.descricao}</p>
                <button onClick={() => { setSelectedId(s.id); setShowModal(true); }}>
                  Ver Detalhes
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && selectedId && (
        <Modal id={selectedId} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}