"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getPortfolioByServico } from "@/service/portfolioService";
import { getAvaliacoesByServico, ResumoAvaliacao } from "@/service/avaliacaoService";
import { registrarContato } from "@/service/contatoWhatsappService";
import { criarServicoRealizado } from "@/service/servicoRealizadoService";
import styles from "./Modal.module.css";
import { FaTimes, FaWhatsapp, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

interface ModalProps {
  profissional: {
    id: number;
    nome?: string;
    categoria?: string;
    descricao?: string;
    telefone?: string;
    precos?: any[]; 
    portfolio?: any[]; 
    disponivel?: boolean; 
  };
  onClose: () => void;
}

export default function Modal({ profissional, onClose }: ModalProps) {
  const router = useRouter();
  const [fotos, setFotos] = useState<{ id: number; url: string }[]>([]);
  const [resumo, setResumo] = useState<ResumoAvaliacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [fotoAmpliada, setFotoAmpliada] = useState<string | null>(null);

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

  const handleContatoClick = async () => {
    if (profissional.disponivel === false) {
      toast.error("Este profissional não está recebendo contatos no momento.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Para entrar em contato, faça login primeiro!");
      router.push("/login");
      return;
    }
    
    if (!profissional.telefone) {
      toast.error("Este profissional não tem telefone cadastrado.");
      return;
    }

    try {
      await Promise.all([
        registrarContato(profissional.id),
        criarServicoRealizado(profissional.id),
      ]);
    } catch (err) {
      console.error("Erro ao registrar contato:", err);
    }

    localStorage.setItem("@ProConnect:avaliar", JSON.stringify({
      id: profissional.id,
      nome: profissional.nome || "Profissional"
    }));

    const numeroLimpo = profissional.telefone.replace(/\D/g, "");
    const mensagem = encodeURIComponent(`Olá, vi o seu perfil no ProConnect e gostaria de pedir um orçamento.`);
    window.open(`https://wa.me/55${numeroLimpo}?text=${mensagem}`, "_blank");

    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar modal">
          <FaTimes />
        </button>
        
        <div className={styles.header}>
           <h2>{profissional.nome || "Profissional"}</h2>
           <div className={styles.badgeRow}>
              <span className={styles.badgeCategoria}>{profissional.categoria}</span>
              {resumo && resumo.total > 0 && (
                <div className={styles.ratingInfo}>
                  <div className={styles.starsContainer}>
                    {renderStars(resumo.media)}
                  </div>
                  <span className={styles.ratingText}>
                    {resumo.media.toFixed(1)} ({resumo.total})
                  </span>
                </div>
              )}
           </div>
        </div>
        
        <div className={styles.info}>
          <p className={styles.descricao}>{profissional.descricao}</p>
        </div>

        <div className={styles.section}>
          <h3>Tabela de Preços</h3>
          {profissional.precos && profissional.precos.length > 0 ? (
            <div className={styles.tabelaPrecos}>
              {profissional.precos.map((p, index) => (
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
              {fotos.map(f => (
                <div key={f.id} className={styles.fotoWrapper} onClick={() => setFotoAmpliada(f.url)}>
                  <img src={f.url} className={styles.foto} alt="Trabalho do profissional" />
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noData}>Nenhuma foto disponível.</p>
          )}
        </div>

        {/* ✅ SECÇÃO ATUALIZADA: Comentários com nome do usuário */}
        <div className={styles.section}>
          <h3>Avaliações e Comentários</h3>
          {resumo?.avaliacoes && resumo.avaliacoes.length > 0 ? (
            <div className={styles.listaAvaliacoes}>
              {resumo.avaliacoes.map((av: any, index: number) => (
                <div key={index} className={styles.cardAvaliacao}>
                  {/* Nome de quem fez o comentário */}
                  <strong className={styles.nomeAvaliador}>
                    {av.usuario?.nome || "Usuário anônimo"}
                  </strong>

                  <div className={styles.estrelasComentario}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar 
                        key={star} 
                        color={star <= av.star ? "#ffc107" : "#e4e5e9"} 
                        size={14} 
                      />
                    ))}
                  </div>
                  {av.descricao ? (
                    <p className={styles.textoComentario}>"{av.descricao}"</p>
                  ) : (
                    <p className={styles.textoComentarioVazio}>(Avaliação sem comentário)</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noData}>Este serviço ainda não possui avaliações. Seja o primeiro a avaliar!</p>
          )}
        </div>

        <button 
          onClick={handleContatoClick} 
          className={styles.btnWhats}
          disabled={profissional.disponivel === false}
          style={{
            opacity: profissional.disponivel === false ? 0.5 : 1,
            cursor: profissional.disponivel === false ? "not-allowed" : "pointer",
            backgroundColor: profissional.disponivel === false ? "#94a3b8" : ""
          }}
        >
          <FaWhatsapp style={{ fontSize: "1.2rem" }} /> 
          {profissional.disponivel === false ? "Profissional Indisponível" : "Falar no WhatsApp"}
        </button>

        {fotoAmpliada && (
          <div className={styles.lightbox} onClick={() => setFotoAmpliada(null)}>
            <button className={styles.fecharLightbox} aria-label="Fechar imagem">
              <FaTimes />
            </button>
            <img src={fotoAmpliada} alt="Imagem ampliada" className={styles.imagemAmpliada} />
          </div>
        )}
      </div>
    </div>
  );
}