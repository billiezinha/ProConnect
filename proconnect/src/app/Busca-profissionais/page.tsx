"use client";
import { useState, useEffect, useMemo } from "react";
import { getServicos } from "@/service/servicoService";
import { Servico } from "@/interfaces/ServicoProps";
import styles from "./page.module.css";
import { FaSearch, FaHeart, FaRegHeart, FaTimes } from "react-icons/fa"; // Trocado Arrow por Times (X)
import Modal from "@/components/Modal";
import { LoadingGrid } from "@/components/loading/Loading";
import toast from "react-hot-toast";
import { categoryIcons, defaultIcon } from "../utils/categoryIcons";

export default function BuscaProfissionaisPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
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

  const filteredServicos = useMemo(() => {
    const t = searchTerm.toLowerCase();
    return servicos.filter(s => {
      const matchesSearch = s.nomeNegocio.toLowerCase().includes(t) || s.descricao.toLowerCase().includes(t);
      const matchesCategory = selectedCategory ? s.categoria?.nomeServico === selectedCategory : true;
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

          {/* LÓGICA DE CATEGORIAS COMPACTA */}
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
                    <span className={styles.btnIcon}>{categoryIcons[cat]}</span>
                    {cat}
                  </button>
                ))}
              </>
            ) : (
              /* FILTRO ATIVO: Estilo 'Chip' no canto esquerdo */
              <div className={styles.compactFilterWrapper}>
                <div className={styles.activeCategoryChip}>
                  <span className={styles.chipIcon}>{categoryIcons[selectedCategory]}</span>
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
          <p className={styles.errorState}>{error}</p>
        ) : (
          <div className={styles.resultsGrid}>
            {filteredServicos.length > 0 ? (
              filteredServicos.map((s) => (
                <div key={s.id} className={styles.servicoCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardCategoryIcon}>
                      {categoryIcons[s.categoria?.nomeServico] || defaultIcon}
                    </span>
                    
                    <button 
                      className={styles.favButton}
                      onClick={() => toggleFavorito(s.id, s.nomeNegocio)}
                    >
                      {favoritos.includes(s.id) ? <FaHeart className={styles.iconFill} /> : <FaRegHeart className={styles.iconOutline} />}
                    </button>
                  </div>

                  <div className={styles.cardContent}>
                    <h3 className={styles.servicoTitle}>{s.nomeNegocio}</h3>
                    <p className={styles.servicoDescription}>{s.descricao}</p>
                  </div>

                  <div className={styles.cardFooter}>
                    <button 
                      className={styles.detailsButton}
                      onClick={() => { setSelectedId(s.id); setShowModal(true); }}
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.emptyState}>Nenhum profissional encontrado.</p>
            )}
          </div>
        )}
      </main>

      {showModal && selectedId && (
        <Modal id={selectedId} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}