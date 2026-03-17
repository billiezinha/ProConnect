"use client";
import { useState, useEffect, useMemo } from "react";
import { getServicos } from "@/service/servicoService";
import { Servico } from "@/interfaces/ServicoProps";
import styles from "./page.module.css";
import { FaSearch, FaHeart, FaRegHeart, FaTimes, FaMapMarkerAlt, FaDatabase } from "react-icons/fa";
import Modal from "@/components/modal/Modal";
import { LoadingGrid } from "@/components/loading/Loading";
import toast from "react-hot-toast";
import { categoryIcons, defaultIcon } from "../utils/categoryIcons";
import AvaliacaoPendente from "@/components/AvaliacaoPendente/AvaliacaoPendente";

export default function BuscaProfissionaisPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  
  // ESTADOS DOS FILTROS
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchCidade, setSearchCidade] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // ESTADOS DO MODAL E FAVORITOS
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

  const limparFiltros = () => {
    setSearchTerm("");
    setSearchCidade("");
    setSelectedCategory(null);
  };

  // ✨ LÓGICA DE FILTRAGEM SEGURA (ULTRA RESILIENTE)
  const filteredServicos = useMemo(() => {
    const termoBusca = searchTerm.toLowerCase().trim();
    const cidadeBusca = searchCidade.toLowerCase().trim();
    const catSelecionada = selectedCategory ? selectedCategory.toLowerCase().trim() : null;

    // Função interna para limpar acentos na hora da comparação
    const removeAcentos = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return servicos.filter(s => {
      const titulo = (s.nomeNegocio || "").toLowerCase();
      const desc = (s.descricao || "").toLowerCase();
      const categoriaDB = (s.categoria?.nomeServico || "").toLowerCase();
      const cidUsuario = (s.usuario?.cidade || "").toLowerCase();
      const cidLocal = (s.localizacao?.cidade || "").toLowerCase();

      // 1. Passa na busca da barra de pesquisa geral?
      const passaTexto = !termoBusca || 
        titulo.includes(termoBusca) || 
        desc.includes(termoBusca) || 
        categoriaDB.includes(termoBusca);

      // 2. Passa na busca de cidade?
      const passaCidade = !cidadeBusca || 
        cidUsuario.includes(cidadeBusca) || 
        cidLocal.includes(cidadeBusca);

      // 3. Passa no clique do botão de categoria?
      let passaBotao = true;
      if (catSelecionada) {
        const catDBLimpa = removeAcentos(categoriaDB);
        const catBotaoLimpa = removeAcentos(catSelecionada);
        const tituloLimpo = removeAcentos(titulo);
        const descLimpa = removeAcentos(desc);

        // Se o banco tiver a categoria OU se o título/descrição tiver a palavra do botão
        passaBotao = catDBLimpa.includes(catBotaoLimpa) || 
                     tituloLimpo.includes(catBotaoLimpa) || 
                     descLimpa.includes(catBotaoLimpa);
      }

      return passaTexto && passaCidade && passaBotao;
    });
  }, [searchTerm, searchCidade, selectedCategory, servicos]);

  return (
    <div className={styles.body}>
      <main className={styles.container}>
        <div className={styles.searchSection}>
          <h1 className={styles.title}>Encontre o profissional certo</h1>
          
          <div className={styles.searchWrapper}>
            <div className={styles.searchBar}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Qual profissão ou serviço?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            
            <div className={styles.searchBar}>
              <FaMapMarkerAlt className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Em qual cidade?"
                value={searchCidade}
                onChange={(e) => setSearchCidade(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className={styles.categoriesRow}>
            {!selectedCategory ? (
              <>
                <button onClick={() => setSelectedCategory(null)} className={styles.catBtnActive}>
                  Todos
                </button>
                {Object.keys(categoryIcons).map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={styles.catBtn}>
                    <span className={styles.btnIcon}>{categoryIcons[cat as keyof typeof categoryIcons]}</span>
                    {cat}
                  </button>
                ))}
              </>
            ) : (
              <div className={styles.compactFilterWrapper}>
                <div className={styles.activeCategoryChip}>
                  <span className={styles.chipIcon}>{categoryIcons[selectedCategory as keyof typeof categoryIcons]}</span>
                  <span className={styles.chipText}>{selectedCategory}</span>
                  <button onClick={() => setSelectedCategory(null)} className={styles.closeChipBtn} title="Remover filtro">
                    <FaTimes />
                  </button>
                </div>
                <span className={styles.resultsCount}>{filteredServicos.length} resultados encontrados</span>
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
                const iconToRender = (catName && catName in categoryIcons) ? categoryIcons[catName as keyof typeof categoryIcons] : defaultIcon;
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
                      <button className={styles.favButton} onClick={() => toggleFavorito(s.id, s.nomeNegocio)}>
                        {favoritos.includes(s.id) ? <FaHeart className={styles.iconFill} /> : <FaRegHeart className={styles.iconOutline} />}
                      </button>
                    </div>

                    <div className={styles.cardContent}>
                      {/* ✨ ETIQUETAS DE DIAGNÓSTICO (O SEGREDO PARA VER O QUE VEM DO BANCO) */}
                      <div style={{ display: 'flex', gap: '5px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.7rem', background: '#e2e8f0', padding: '3px 8px', borderRadius: '10px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaDatabase /> Cat DB: <strong>{s.categoria?.nomeServico || "Vazio"}</strong>
                        </span>
                        <span style={{ fontSize: '0.7rem', background: '#e2e8f0', padding: '3px 8px', borderRadius: '10px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                           <FaDatabase /> Cid DB: <strong>{s.localizacao?.cidade || s.usuario?.cidade || "Vazio"}</strong>
                        </span>
                      </div>

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
                      <button className={styles.detailsButton} onClick={() => { setSelectedProfissional(s); setShowModal(true); }}>
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyStateWrapper}>
                <p className={styles.emptyState}>Nenhum profissional encontrado com estes filtros.</p>
                <button onClick={limparFiltros} className={styles.clearFiltersBtn}>Limpar todos os filtros</button>
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