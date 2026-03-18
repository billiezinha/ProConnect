"use client";
import { useState, useEffect, useMemo } from "react";
import { getServicos } from "@/service/servicoService";
import { getFavoritosIds, adicionarFavorito, removerFavorito } from "@/service/favoritoService"; // ✅ Importados os novos serviços
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

    // ✅ Carrega os favoritos do servidor se o usuário estiver logado
    const carregarFavoritos = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const favsServer = await getFavoritosIds();
        setFavoritos(favsServer);
      }
    };

    fetchServicos();
    carregarFavoritos();
  }, []);

  // ✅ Função otimizada para salvar os favoritos na API
  const toggleFavorito = async (id: number, nome: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Para favoritar, faça login primeiro!");
      return;
    }

    const isJaFavorito = favoritos.includes(id);

    // 1. Atualização Otimista: Muda na tela imediatamente para dar sensação de rapidez
    setFavoritos(prev => 
      isJaFavorito ? prev.filter(favId => favId !== id) : [...prev, id]
    );

    try {
      // 2. Chama a API em segundo plano
      if (isJaFavorito) {
        await removerFavorito(id);
        toast.success(`${nome} removido dos favoritos.`);
      } else {
        await adicionarFavorito(id);
        toast.success(`${nome} favoritado!`, { icon: '❤️' });
      }
    } catch (error) {
      // 3. Se a API falhar, reverte a cor do coração e avisa o erro
      setFavoritos(prev => 
        isJaFavorito ? [...prev, id] : prev.filter(favId => favId !== id)
      );
      toast.error("Erro ao guardar o favorito no servidor.");
    }
  };

  const filteredServicos = useMemo(() => {
    const busca = searchTerm.toLowerCase().trim();
    const catSelecionada = selectedCategory ? selectedCategory.toLowerCase().trim() : null;
    const removeAcentos = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return servicos.filter(s => {
      const titulo = (s.nomeNegocio || "").toLowerCase();
      const desc = (s.descricao || "").toLowerCase();
      const categoriaDB = (s.categoria?.nomeServico || "").toLowerCase();
      const cidade = (s.localizacao?.cidade || s.usuario?.cidade || "").toLowerCase();

      const passaBusca = !busca || 
        titulo.includes(busca) || 
        desc.includes(busca) || 
        categoriaDB.includes(busca) ||
        cidade.includes(busca);

      let passaBotao = true;
      if (catSelecionada) {
        passaBotao = removeAcentos(categoriaDB).includes(removeAcentos(catSelecionada));
      }

      return passaBusca && passaBotao;
    });
  }, [searchTerm, selectedCategory, servicos]);

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
                placeholder="Busque por serviço, profissional ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              {searchTerm && (
                <button className={styles.clearSearchIcon} onClick={() => setSearchTerm("")}>
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          <div className={styles.categoriesRow}>
            <button 
              onClick={() => setSelectedCategory(null)} 
              className={!selectedCategory ? styles.catBtnActive : styles.catBtn}
            >
              Todos
            </button>
            {Object.keys(categoryIcons).map(cat => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)} 
                className={selectedCategory === cat ? styles.catBtnActive : styles.catBtn}
              >
                <span className={styles.btnIcon}>{categoryIcons[cat as keyof typeof categoryIcons]}</span>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? <LoadingGrid /> : (
          <div className={styles.resultsGrid}>
            {filteredServicos.length > 0 ? (
              filteredServicos.map((s) => {
                const isDisponivel = s.usuario?.disponivel !== false;
                const catName = s.categoria?.nomeServico;
                const icon = (catName && catName in categoryIcons) ? categoryIcons[catName as keyof typeof categoryIcons] : defaultIcon;

                return (
                  <div key={s.id} className={styles.servicoCard}>
                    <div className={styles.cardImageContainer}>
                      {s.imagem ? (
                        <img src={s.imagem} alt={s.nomeNegocio} className={styles.cardImage} />
                      ) : (
                        <div className={styles.cardImagePlaceholder}>
                          <span className={styles.cardCategoryIcon}>{icon}</span>
                        </div>
                      )}
                      <button className={styles.favButton} onClick={() => toggleFavorito(s.id, s.nomeNegocio)}>
                        {favoritos.includes(s.id) ? <FaHeart className={styles.iconFill} /> : <FaRegHeart className={styles.iconOutline} />}
                      </button>
                    </div>

                    <div className={styles.cardContent}>
                      <h3 className={styles.servicoTitle}>{s.nomeNegocio}</h3>
                      
                      <div className={`${styles.statusBadge} ${isDisponivel ? styles.statusOn : styles.statusOff}`}>
                        <span className={`${styles.statusDot} ${isDisponivel ? styles.dotOn : styles.dotOff}`}></span>
                        {isDisponivel ? "Disponível agora" : "Indisponível"}
                      </div>

                      <p className={styles.servicoDescription}>
                        {s.descricao.length > 110 ? `${s.descricao.substring(0, 110)}...` : s.descricao}
                      </p>
                      
                      <div className={styles.cityText}>
                        📍 {s.localizacao?.cidade || s.usuario?.cidade || "Local não informado"}
                      </div>
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
                <p className={styles.emptyState}>Nenhum profissional encontrado.</p>
                <button onClick={() => {setSearchTerm(""); setSelectedCategory(null);}} className={styles.clearSearchBtn}>Limpar Filtros</button>
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