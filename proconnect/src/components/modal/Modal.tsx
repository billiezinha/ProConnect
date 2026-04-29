import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getPortfolioByServico } from "@/service/portfolioService";
import { getAvaliacoesByServico, ResumoAvaliacao } from "@/service/avaliacaoService";
import { registrarContato } from "@/service/contatoWhatsappService";
import { criarServicoRealizado } from "@/service/servicoRealizadoService";
import styles from "./Modal.module.css";
// ✅ Importados ícones de navegação e whatsapp
import { FaTimes, FaChevronLeft, FaChevronRight, FaStar, FaRegStar, FaStarHalfAlt, FaWhatsapp, FaComments } from "react-icons/fa"; 
import api from '@/service/api';
import { getMe } from '@/service/userService';

interface ModalProps {
  profissional: any;
  onClose: () => void;
  onOpenChat?: (userId: number | undefined, nome?: string, imagem?: string, servicoId?: number) => void;
  isMeuServico?: boolean;
}

export default function Modal({ profissional, onClose, onOpenChat, isMeuServico }: ModalProps) {
  const router = useRouter();
  const [fotos, setFotos] = useState<{ id: number; url: string }[]>([]);
  const [resumo, setResumo] = useState<ResumoAvaliacao | null>(null);
  const [loading, setLoading] = useState(true);
  
  // ✅ Alterado: Agora guardamos o INDEX da foto aberta
  const [fotoIndex, setFotoIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!profissional?.id) return;
      try {
        setLoading(true);
        const [portfolioData, avaliacaoData] = await Promise.all([ 
          getPortfolioByServico(profissional.id).catch(() => []),
          getAvaliacoesByServico(profissional.id).catch(() => ({ media: 0, total: 0, avaliacoes: [] }))
        ]);
        setFotos(portfolioData);
        setResumo(avaliacaoData);
      } catch (error) {
        console.error("Erro ao carregar dados do modal:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [profissional.id]);

  // ✅ Funções para navegar entre as fotos
  const proximaFoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fotoIndex !== null) {
      setFotoIndex((prev) => (prev! + 1) % fotos.length);
    }
  };

  const fotoAnterior = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fotoIndex !== null) {
      setFotoIndex((prev) => (prev! - 1 + fotos.length) % fotos.length);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className={styles.starFull} />);
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(<FaStarHalfAlt key={i} className={styles.starFull} />);
      } else {
        stars.push(<FaRegStar key={i} className={styles.starEmpty} />);
      }
    }
    return stars;
  };

  const checkLogin = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Para entrar em contato, faça login primeiro!");
      router.push("/login");
      return false;
    }
    return true;
  };

  const handleChatClick = async () => {
    if (profissional.disponivel === false) {
      toast.error("Este profissional não está recebendo contatos no momento.");
      return;
    }
    if (!checkLogin()) return;

    try {
      try {
        await criarServicoRealizado(profissional.id);
      } catch (analyticsErr) {
        console.warn("Métricas de contato falharam:", analyticsErr);
      }
      
      if (onOpenChat) {
         const targetId = profissional.usuario?.id || profissional.usuarioId;
         const targetNome = profissional.nomeNegocio || profissional.nome || "Profissional";
         const targetImagem = profissional.imagem || profissional.portfolio?.[0]?.url || "";
         
         onOpenChat(targetId, targetNome, targetImagem, profissional.id);
      }
    } catch (err) {
      toast.error("Não foi possível iniciar a conversa.");
    } finally {
      onClose();
    }
  };

  const handleWhatsAppClick = async () => {
    if (profissional.disponivel === false) {
      toast.error("Este profissional não está recebendo contatos no momento.");
      return;
    }
    if (!checkLogin()) return;

    try {
      await registrarContato(profissional.id);
      
      const telefone = profissional.usuario?.telefone || profissional.telefone;
      if (telefone) {
        const numeroLimpo = telefone.replace(/\D/g, "");
        const numeroWpp = numeroLimpo.startsWith("55") ? numeroLimpo : `55${numeroLimpo}`;
        const nomeSvc = profissional.nomeNegocio || profissional.nome || "serviço";
        const msg = encodeURIComponent(`Olá, vi seu serviço (${nomeSvc}) no ProConnect e gostaria de mais informações!`);
        window.open(`https://wa.me/${numeroWpp}?text=${msg}`, "_blank");
      } else {
        toast.error("O profissional não disponibilizou um número de WhatsApp.");
      }
    } catch (err) {
      console.error("Erro ao registrar WhatsApp:", err);
      toast.error("Não foi possível abrir o WhatsApp.");
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar modal">
          <FaTimes />
        </button>
        
        <div className={styles.header}>
           <h2>
             {profissional.nomeNegocio || profissional.nome || "Serviço"}
             {profissional.usuario?.plano === "premium" && (
               <span className={styles.badgePro} title="Profissional Premium"><FaStar color="var(--cor-primaria)" size={14} style={{ marginLeft: 6, marginBottom: 2 }} /></span>
             )}
           </h2>
           <div className={styles.badgeRow}>
              <span className={styles.badgeCategoria}>{profissional.categoria?.nomeServico || profissional.categoria || "Serviço"}</span>
              <div className={styles.ratingInfo}>
                <div className={styles.starsContainer}>
                  {renderStars(resumo?.media || 0)}
                </div>
                <span className={styles.ratingText}>
                  {(resumo?.media || 0).toFixed(1)} ({resumo?.total || 0})
                </span>
              </div>
           </div>
        </div>
        
        <div className={styles.scrollBody}>
          <div className={styles.section}>
            <h3>Detalhes</h3>
            <p className={styles.descricao}>{profissional.descricao}</p>
          </div>

          <div className={styles.section}>
            <h3>Tabela de Preços</h3>
            {profissional.precos && profissional.precos.length > 0 ? (
              <div className={styles.tabelaPrecos}>
                {profissional.precos.map((p: any, index: number) => (
                  <div key={index} className={styles.itemPreco}>
                    <span>{p.nomeservico}</span>
                    <strong>R$ {Number(p.precificacao).toFixed(2)}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noData}>Preços sob consulta.</p>
            )}
          </div>

          <div className={styles.section}>
            <h3>Portfólio</h3>
            {loading ? (
              <p className={styles.loadingText}>Carregando galeria...</p>
            ) : fotos.length > 0 ? (
              <div className={styles.gridPortfolio}>
                {fotos.map((f, index) => (
                  <div key={f.id} className={styles.fotoWrapper} onClick={() => setFotoIndex(index)}>
                    <img src={f.url} className={styles.foto} alt="Trabalho" />
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noData}>Nenhuma foto disponível.</p>
            )}
          </div>

          <div className={styles.section}>
            <h3>Avaliações e Comentários</h3>
            {resumo?.avaliacoes && resumo.avaliacoes.length > 0 ? (
              <div className={styles.listaAvaliacoes}>
                {resumo.avaliacoes.map((av: any, index: number) => (
                  <div key={index} className={styles.cardAvaliacao}>
                    <div className={styles.headerAvaliacao}>
                      <span className={styles.nomeAvaliador}>{av.usuario?.nome || "Usuário"}</span>
                      <div className={styles.starsPequenas}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar key={star} color={star <= av.star ? "#ffc107" : "#e4e5e9"} size={12} />
                        ))}
                      </div>
                    </div>
                    {av.descricao && <p className={styles.textoComentario}>"{av.descricao}"</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noData}>Ainda não possui avaliações.</p>
            )}
          </div>
        </div>

        <div className={styles.footer}>
            {isMeuServico ? (
              <p className={styles.noData} style={{ textAlign: 'center', margin: 0 }}>Este é o seu serviço, você não pode contatar a si mesmo.</p>
            ) : (
              <div className={styles.contactButtonsGrid}>
                <button 
                  onClick={handleChatClick} 
                  className={styles.btnContactChat} 
                  disabled={profissional.disponivel === false}
                >
                  <FaComments size={20} />
                  <span>Chat no ProConnect</span>
                </button>
                
                <button 
                  onClick={handleWhatsAppClick} 
                  className={styles.btnContactWpp} 
                  disabled={profissional.disponivel === false}
                >
                  <FaWhatsapp size={20} />
                  <span>Chamar no WhatsApp</span>
                </button>
              </div>
            )}
        </div>

        {fotoIndex !== null && (
          <div className={styles.lightbox} onClick={() => setFotoIndex(null)}>
            <button className={styles.fecharLightbox} onClick={() => setFotoIndex(null)}>
              <FaTimes />
            </button>
            
            {fotos.length > 1 && (
              <>
                <button className={styles.navBtnLeft} onClick={fotoAnterior}>
                  <FaChevronLeft />
                </button>
                <button className={styles.navBtnRight} onClick={proximaFoto}>
                  <FaChevronRight />
                </button>
              </>
            )}

            <img 
              src={fotos[fotoIndex].url} 
              alt="Imagem ampliada" 
              className={styles.imagemAmpliada} 
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </div>
  );
}