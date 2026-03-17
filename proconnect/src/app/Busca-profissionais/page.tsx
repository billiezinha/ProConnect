"use client";
import { useState, useEffect, useMemo } from "react";
import { getServicos } from "@/service/servicoService";
import { Servico } from "@/interfaces/ServicoProps";
import styles from "./page.module.css";
import { FaSearch, FaHeart, FaRegHeart, FaTimes } from "react-icons/fa";
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
          <p className={styles.errorState}>{error}</p>
        ) : (
          <div className={styles.resultsGrid}>
            {filteredServicos.length > 0 ? (
              filteredServicos.map((s) => {
                const catName = s.categoria?.nomeServico;
                const iconToRender = (catName && catName in categoryIcons) 
                  ? categoryIcons[catName as keyof typeof categoryIcons] 
                  : defaultIcon;

                return (
                  <div key={s.id} className={styles.servicoCard}>
                    
                    {/* ✅ IMAGEM DE CAPA */}
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
                      <p className={styles.servicoDescription}>{s.descricao}</p>
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
              <p className={styles.emptyState}>Nenhum profissional encontrado.</p>
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
            precos: selectedProfissional.preco
          }} 
          onClose={() => setShowModal(false)} 
        />
      )}

      <AvaliacaoPendente />
    </div>
  );
}