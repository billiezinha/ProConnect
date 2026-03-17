"use client";
import { useState, useEffect, useMemo } from "react";
import { getServicos } from "@/service/servicoService";
import { Servico } from "@/interfaces/ServicoProps";
import styles from "./page.module.css";
import { FaSearch, FaHeart, FaRegHeart, FaTimes, FaFilter } from "react-icons/fa";
import Modal from "@/components/modal/Modal";
import { LoadingGrid } from "@/components/loading/Loading";
import toast from "react-hot-toast";
import { categoryIcons, defaultIcon } from "../utils/categoryIcons";
import AvaliacaoPendente from "@/components/AvaliacaoPendente/AvaliacaoPendente";

export default function BuscaProfissionaisPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedProfissional, setSelectedProfissional] = useState<Servico | null>(null);
  const [favoritos, setFavoritos] = useState<number[]>([]);

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

    const carregarFavoritos = () => {
      const salvos = localStorage.getItem("@ProConnect:favoritos");
      if (salvos) setFavoritos(JSON.parse(salvos));
    };

    fetchServicos();
    carregarFavoritos();
  }, []);

  const toggleFavorito = (id: number, nome: string) => {
    let novaLista;
    if (favoritos.includes(id)) {
      novaLista = favoritos.filter(favId => favId !== id);
      toast.success(`${nome} removido.`);
    } else {
      novaLista = [...favoritos, id];
      toast.success(`${nome} favoritado!`, { icon: '❤️' });
    }
    setFavoritos(novaLista);
    localStorage.setItem("@ProConnect:favoritos", JSON.stringify(novaLista));
  };

  // Limpa todos os filtros de uma vez
  const limparFiltros = () => {
    setSearchTerm("");
    setSelectedCategory(null);
  };

  const filteredServicos = useMemo(() => {
    const t = searchTerm.toLowerCase().trim();
    return servicos.filter(s => {
      const nomeNegocio = s.nomeNegocio?.toLowerCase() || "";
      const descricao = s.descricao?.toLowerCase() || "";
      const matchesSearch = nomeNegocio.includes(t) || descricao.includes(t);
      const matchesCategory = selectedCategory 
        ? s.categoria?.nomeServico === selectedCategory 
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, servicos]);

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

          <div className={styles.categoriesRow}>
            {!selectedCategory ? (
              <>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className={styles.catBtnActive}
                >
                  Todos
                </button>
                {Object.keys(categoryIcons).map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={styles.catBtn}
                  >
                    <span className={styles.btnIcon}>{categoryIcons[cat as keyof typeof categoryIcons]}</span>
                    {cat}
                  </button>
                ))}
              </>
            ) : (
              <div className={styles.compactFilterWrapper}>
                <div className={styles.activeCategoryChip}>
                  <span className={styles.chipIcon}>
                    {categoryIcons[selectedCategory as keyof typeof categoryIcons]}
                  </span>
                  <span className={styles.chipText}>{selectedCategory}</span>
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className={styles.closeChipBtn}
                    title="Remover filtro"
                  >
                    <FaTimes />
                  </button>
                </div>
                <span className={styles.resultsCount}>
                  {filteredServicos.length} resultados encontrados
                </span>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <LoadingGrid />
        ) : error ? (
          <div className={styles.errorContainer}>
            <p className={styles.errorState}>{error}</p>
            <button onClick={() => window.location.reload()} className={styles.retryBtn}>Tentar novamente</button>
          </div>
        ) : (
          <div className={styles.resultsGrid}>
            {filteredServicos.length > 0 ? (
              filteredServicos.map((s) => {
                const catName = s.categoria?.nomeServico;
                const iconToRender = (catName && catName in categoryIcons) 
                  ? categoryIcons[catName as keyof typeof categoryIcons] 
                  : defaultIcon;
                
                // Determina se está disponível (padrão true se não definido)
                const isDisponivel = s.usuario?.disponivel !== false;

                return (
                  <div key={s.id} className={styles.servicoCard}>
                    <div className={styles.cardImageContainer}>
                      {s.imagem ? (
                        <img src={s.imagem} alt={s.nomeNegocio} className={styles.cardImage} />
                      ) : (
                        <div className={styles.cardImagePlaceholder}>
                          <span className={styles.cardCategoryIcon}>{iconToRender}</span>
                        </div>
                      )}
                      <button 
                        className={styles.favButton}
                        onClick={() => toggleFavorito(s.id, s.nomeNegocio)}
                        title="Favoritar"
                      >
                        {favoritos.includes(s.id) ? (
                          <FaHeart className={styles.iconFill} />
                        ) : (
                          <FaRegHeart className={styles.iconOutline} />
                        )}
                      </button>
                    </div>

                    <div className={styles.cardContent}>
                      <h3 className={styles.servicoTitle}>{s.nomeNegocio}</h3>
                      
                      <div className={`${styles.statusBadge} ${isDisponivel ? styles.statusOn : styles.statusOff}`}>
                        <span className={`${styles.statusDot} ${isDisponivel ? styles.dotOn : styles.dotOff}`}></span>
                        {isDisponivel ? "Disponível agora" : "Indisponível no momento"}
                      </div>

                      <p className={styles.servicoDescription}>
                        {s.descricao.length > 120 ? `${s.descricao.substring(0, 120)}...` : s.descricao}
                      </p>
                    </div>

                    <div className={styles.cardFooter}>
                      <button 
                        className={styles.detailsButton}
                        onClick={() => { 
                          setSelectedProfissional(s); 
                          setShowModal(true); 
                        }}
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyStateWrapper}>
                <p className={styles.emptyState}>Nenhum profissional encontrado com estes filtros.</p>
                <button onClick={limparFiltros} className={styles.clearFiltersBtn}>
                  Limpar todos os filtros
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {showModal && selectedProfissional && (
        <Modal 
          profissional={{ 
            id: selectedProfissional.id,
            nome: selectedProfissional.nomeNegocio,
            categoria: selectedProfissional.categoria?.nomeServico,
            descricao: selectedProfissional.descricao,
            telefone: selectedProfissional.usuario?.telefone,
            precos: selectedProfissional.preco,
            portfolio: selectedProfissional.portfolio,
            disponivel: selectedProfissional.usuario?.disponivel !== false
          }} 
          onClose={() => setShowModal(false)} 
        />
      )}

      <AvaliacaoPendente />
    </div>
  );
}