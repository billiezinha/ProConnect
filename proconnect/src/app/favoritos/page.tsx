"use client";
import { useState, useEffect } from "react";
import { getServicos } from "@/service/servicoService";
import { getFavoritosIds, removerFavorito } from "@/service/favoritoService"; 
import { Servico } from "@/interfaces/ServicoProps";
// ✨ Importa o CSS da página de busca para garantir o visual idêntico ✨
import styles from "../Busca-profissionais/page.module.css";
import Modal from "@/components/modal/Modal";
import { LoadingGrid } from "@/components/loading/Loading";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
// ✅ Importação corrigida para a nova lógica de grupos
import { getServiceIcon, defaultIcon } from "../utils/categoryIcons";

export default function FavoritosPage() {
  const [servicosFavoritos, setServicosFavoritos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfissional, setSelectedProfissional] = useState<Servico | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const carregarFavoritos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const idsFavoritos = await getFavoritosIds();

        if (idsFavoritos.length > 0) {
          const todos = await getServicos();
          // Filtra os serviços que estão na lista de IDs favoritados vinda da API
          const filtrados = todos.filter((s: Servico) => idsFavoritos.includes(s.id));
          setServicosFavoritos(filtrados);
        } else {
          setServicosFavoritos([]);
        }
      } catch (error) {
        console.error("Erro ao carregar favoritos", error);
      } finally {
        setLoading(false);
      }
    };

    carregarFavoritos();
  }, []);

  const handleRemoverFavorito = async (id: number, nome: string) => {
    // Atualização otimista: Remove do ecrã instantaneamente
    setServicosFavoritos(prev => prev.filter(s => s.id !== id));
    
    try {
      await removerFavorito(id);
      toast.success(`${nome} removido dos favoritos.`);
    } catch (error) {
      toast.error("Erro ao remover o favorito.");
      // Se falhar na API, recarrega para sincronizar o estado
      window.location.reload(); 
    }
  };

  if (loading) return <div className={styles.body}><div className={styles.container}><LoadingGrid /></div></div>;

  return (
    <div className={styles.body}>
      <main className={styles.container}>
        <div className={styles.searchSection}>
          <h1 className={styles.title}>
            <FaHeart style={{ color: 'var(--cor-primaria)', marginRight: '10px' }} />
            Meus Profissionais Salvos
          </h1>
          <p className={styles.subtitle}>Consulte aqui os profissionais que guardou para contacto posterior.</p>
        </div>

        <div className={styles.resultsGrid}>
          {servicosFavoritos.length > 0 ? (
            servicosFavoritos.map((s) => {
              // ✅ Lógica corrigida para os ícones (pega o ícone do grupo)
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
                    
                    {/* Botão para desfavoritar (coração cheio) */}
                    <button 
                      className={styles.favButton} 
                      onClick={() => handleRemoverFavorito(s.id, s.nomeNegocio)}
                      title="Remover dos favoritos"
                    >
                      <FaHeart className={styles.iconFill} />
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
                    <button 
                      className={styles.detailsButton}
                      onClick={() => { setSelectedProfissional(s); setShowModal(true); }}
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.emptyStateWrapper} style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem 0" }}>
              <p className={styles.emptyState} style={{ fontSize: "1.2rem", color: "var(--cor-texto-secundario)" }}>
                Ainda não guardou nenhum favorito.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Detalhes Completo */}
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
    </div>
  );
}