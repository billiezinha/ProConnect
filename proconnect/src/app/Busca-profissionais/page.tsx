"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getServicos } from "@/service/servicoService";
import type { Servico } from "@/interfaces/ServicoProps";
import styles from "./page.module.css";
import { FaUserCircle, FaSearch } from "react-icons/fa";

export default function BuscaProfissionaisPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const data = await getServicos();
        setServicos(data);
      } catch { // 'err' removido daqui
        setError("Não foi possível carregar os serviços.");
      } finally {
        setLoading(false);
      }
    };
    fetchServicos();
  }, []);

  const filteredServicos = searchTerm
    ? servicos.filter(
        (servico) =>
          servico.nomeNegocio.toLowerCase().includes(searchTerm.toLowerCase()) ||
          servico.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
          servico.categoria?.nomeServico.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : servicos;

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
                      {servico.preco && servico.preco.length > 0 && (
                         <span className={styles.servicoPrice}>
                           R$ {servico.preco[0].precificacao.toFixed(2)}
                         </span>
                      )}
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
    </div>
  );
}