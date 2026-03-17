"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getPortfolioByServico } from "@/service/portfolioService";
import { getAvaliacoesByServico, ResumoAvaliacao } from "@/service/avaliacaoService";
import styles from "./Modal.module.css";
import { FaTimes } from "react-icons/fa"; // NOVO: Ícone para fechar a foto

interface ModalProps {
  profissional: {
    id: number;
    nome?: string;
    categoria?: string;
    descricao?: string;
    telefone?: string;
    mediaNota?: number | string;
  };
  onClose: () => void;
}

export default function Modal({ profissional, onClose }: ModalProps) {
  const router = useRouter();
  const [fotos, setFotos] = useState<{ id: number; url: string }[]>([]);
  const [resumo, setResumo] = useState<ResumoAvaliacao | null>(null);
  const [loading, setLoading] = useState(true);
  
  // NOVO ESTADO: Guarda o URL da foto que o cliente quer ver maior
  const [fotoAmpliada, setFotoAmpliada] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [portfolioData, avaliacaoData] = await Promise.all([
          getPortfolioByServico(profissional.id),
          getAvaliacoesByServico(profissional.id)
        ]);
        setFotos(portfolioData);
        setResumo(avaliacaoData);
      } catch (error) {
        console.error("Erro ao carregar dados do modal", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [profissional.id]);

  const handleContatoClick = () => {
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

    const numeroLimpo = profissional.telefone.replace(/\D/g, "");
    const mensagem = encodeURIComponent(
      `Olá ${profissional.nome}, vi o seu perfil no ProConnect e gostaria de pedir um orçamento.`
    );
    
    window.open(`https://wa.me/55${numeroLimpo}?text=${mensagem}`, "_blank");
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">×</button>
        
        <div className={styles.header}>
           <h2>{profissional.nome}</h2>
           <span className={styles.badgeCategoria}>{profissional.categoria}</span>
        </div>
        
        <div className={styles.info}>
          <p className={styles.descricao}>{profissional.descricao}</p>
          <div className={styles.ratingHeader}>
            <span className={styles.starMain}>
              ⭐ {resumo?.mediaEstrelas ? resumo.mediaEstrelas.toFixed(1) : "Novo"}
            </span>
            <span className={styles.totalAvaliacoes}>
              ({resumo?.avaliacoes.length || 0} avaliações)
            </span>
          </div>
        </div>

        {/* SEÇÃO PORTFÓLIO */}
        <div className={styles.section}>
          <h3>Portfólio de Trabalhos</h3>
          {loading ? (
            <p className={styles.loadingText}>A carregar galeria...</p>
          ) : fotos.length > 0 ? (
            <div className={styles.gridPortfolio}>
              {fotos.map(f => (
                <div 
                  key={f.id} 
                  className={styles.fotoWrapper}
                  onClick={() => setFotoAmpliada(f.url)} // NOVO: Ao clicar, abre a foto
                >
                  <img src={f.url} className={styles.foto} alt="Trabalho" />
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noData}>Nenhum trabalho cadastrado ainda.</p>
          )}
        </div>

        {/* SEÇÃO AVALIAÇÕES */}
        <div className={styles.section}>
          <h3>O que dizem os clientes</h3>
          <div className={styles.listaAvaliacoes}>
            {resumo?.avaliacoes && resumo.avaliacoes.length > 0 ? (
              resumo.avaliacoes.map(av => (
                <div key={av.id} className={styles.cardAvaliacao}>
                  <div className={styles.avHeader}>
                    <strong>{av.usuario.nome}</strong>
                    <span className={styles.stars}>{"⭐".repeat(av.star)}</span>
                  </div>
                  <p>{av.descricao}</p>
                </div>
              ))
            ) : (
              <p className={styles.noData}>Sê o primeiro a avaliar este serviço!</p>
            )}
          </div>
        </div>

        <button onClick={handleContatoClick} className={styles.btnWhats}>
          Falar no WhatsApp
        </button>

        {/* NOVO: LIGHTBOX (Abre a foto por cima de tudo) */}
        {fotoAmpliada && (
          <div className={styles.lightbox} onClick={() => setFotoAmpliada(null)}>
            <button 
              className={styles.fecharLightbox} 
              aria-label="Fechar imagem"
            >
              <FaTimes />
            </button>
            <img 
              src={fotoAmpliada} 
              alt="Foto do trabalho ampliada" 
              className={styles.imagemAmpliada} 
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        )}

      </div>
    </div>
  );
}