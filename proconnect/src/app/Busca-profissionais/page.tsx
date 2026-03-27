"use client";
import { useState, useEffect, useMemo } from "react";
import { getServicos } from "@/service/servicoService";
import { getFavoritosIds, adicionarFavorito, removerFavorito } from "@/service/favoritoService"; 
import { Servico } from "@/interfaces/ServicoProps";
import styles from "./page.module.css";
import { FaSearch, FaHeart, FaRegHeart, FaTimes, FaCommentDots } from "react-icons/fa";
import Modal from "@/components/modal/Modal";
import { LoadingGrid } from "@/components/loading/Loading";
import toast from "react-hot-toast";
import { categoryGroups, getServiceIcon } from "../utils/categoryIcons";
import AvaliacaoPendente from "@/components/AvaliacaoPendente/AvaliacaoPendente";
import { useRouter } from 'next/navigation';
import api from '@/service/api';
import { getMe } from '@/service/userService';

export default function BuscaProfissionaisPage() {
  const router = useRouter(); 
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedProfissional, setSelectedProfissional] = useState<Servico | null>(null);
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [usuarioAtual, setUsuarioAtual] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        getMe().then(user => setUsuarioAtual(user)).catch(() => {});
      }
    };
    fetchUser();

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

  const iniciarChat = async (profissionalId: number | undefined, nome?: string, imagem?: string, servicoId?: number) => {
    if (!profissionalId) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Precisa de iniciar sessão primeiro para enviar mensagens!");
        router.push('/login');
        return;
      }
      
      const cliente = await getMe();

      if (cliente.id === profissionalId) {
        toast.error("Não pode iniciar um chat com o seu próprio serviço.");
        return;
      }

      const response = await api.post('/chat', {
        clienteId: cliente.id,
        profissionalId: profissionalId
      });

      if (servicoId) {
        localStorage.setItem(`@ProConnect:ChatMetaData:${profissionalId}`, JSON.stringify({
          servicoId,
          nome: nome || "Profissional"
        }));
      }

      router.push(`?chatOpen=true&conversaId=${(response.data as any).id || ''}&profissionalId=${profissionalId}&profissionalNome=${encodeURIComponent(nome || '')}&profissionalImg=${encodeURIComponent(imagem || '')}`);

    } catch (error) {
      console.error("Erro ao iniciar chat:", error);
      toast.error("Não foi possível iniciar a conversa. Tente novamente.");
    }
  };

  const toggleFavorito = async (id: number, nome: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Para favoritar, faça login primeiro!");
      return;
    }

    const isJaFavorito = favoritos.includes(id);

    setFavoritos(prev => 
      isJaFavorito ? prev.filter(favId => favId !== id) : [...prev, id]
    );

    try {
      if (isJaFavorito) {
        await removerFavorito(id);
        toast.success(`${nome} removido.`);
      } else {
        await adicionarFavorito(id);
        toast.success(`${nome} favoritado!`, { icon: '❤️' });
      }
    } catch (error) {
      setFavoritos(prev => 
        isJaFavorito ? [...prev, id] : prev.filter(favId => favId !== id)
      );
      toast.error("Erro ao processar favorito.");
    }
  };

  const filteredServicos = useMemo(() => {
    const busca = searchTerm.toLowerCase().trim();

    return servicos.filter(s => {
      const nomeServicoDB = (s.categoria?.nomeServico || "").toLowerCase().trim();
      const titulo = (s.nomeNegocio || "").toLowerCase();
      const desc = (s.descricao || "").toLowerCase();
      const cidade = (s.localizacao?.cidade || s.usuario?.cidade || "").toLowerCase();

      const passaBusca = !busca || 
        titulo.includes(busca) || 
        desc.includes(busca) || 
        nomeServicoDB.includes(busca) ||
        cidade.includes(busca);

      let passaBotao = true;
      if (selectedCategory) {
        const grupo = categoryGroups[selectedCategory];
        if (grupo) {
          const servicosDoGrupoNormalizados = grupo.services.map(n => n.toLowerCase().trim());
          passaBotao = servicosDoGrupoNormalizados.includes(nomeServicoDB);
        }
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
            {Object.keys(categoryGroups).map(groupName => (
              <button 
                key={groupName} 
                onClick={() => setSelectedCategory(groupName)} 
                className={selectedCategory === groupName ? styles.catBtnActive : styles.catBtn}
              >
                <span className={styles.btnIcon}>{categoryGroups[groupName].icon}</span>
                {groupName}
              </button>
            ))}
          </div>
        </div>

        {loading ? <LoadingGrid /> : (
          <div className={styles.resultsGrid}>
            {filteredServicos.length > 0 ? (
              filteredServicos.map((s) => {
                const isDisponivel = s.usuario?.disponivel !== false;
                const catName = s.categoria?.nomeServico || "";
                const icon = getServiceIcon(catName);

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

                    <div className={styles.cardFooter} style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        style={{ flex: 1 }}
                        className={styles.detailsButton} 
                        onClick={() => { setSelectedProfissional(s); setShowModal(true); }}
                      >
                        Ver Detalhes
                      </button>
                      
                      <button 
                        onClick={() => iniciarChat(s.usuario?.id, s.nomeNegocio, s.imagem || '', s.id)}
                        disabled={usuarioAtual?.id === s.usuario?.id}
                        style={{ 
                          flex: 1, 
                          backgroundColor: (usuarioAtual?.id === s.usuario?.id) ? '#ccc' : '#8B2CF5', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: '8px', 
                          fontWeight: '600', 
                          cursor: (usuarioAtual?.id === s.usuario?.id) ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                        title={(usuarioAtual?.id === s.usuario?.id) ? "Este é o seu próprio serviço." : "Iniciar Chat"}
                      >
                        <FaCommentDots /> {(usuarioAtual?.id === s.usuario?.id) ? "O Seu Serviço" : "Chat"}
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
            usuarioId: selectedProfissional.usuario?.id,
            usuario: selectedProfissional.usuario,
            nome: selectedProfissional.nomeNegocio,
            categoria: selectedProfissional.categoria?.nomeServico,
            descricao: selectedProfissional.descricao,
            telefone: selectedProfissional.usuario?.telefone,
            precos: selectedProfissional.preco,
            portfolio: selectedProfissional.portfolio,
            disponivel: selectedProfissional.usuario?.disponivel !== false
          }} 
          isMeuServico={usuarioAtual?.id === selectedProfissional.usuario?.id}
          onClose={() => setShowModal(false)} 
          onOpenChat={iniciarChat}
        />
      )}
      <AvaliacaoPendente />
    </div>
  );
}