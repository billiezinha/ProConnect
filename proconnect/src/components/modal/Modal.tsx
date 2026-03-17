"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getPortfolioByServico } from "@/service/portfolioService";
import { getAvaliacoesByServico, ResumoAvaliacao } from "@/service/avaliacaoService";
import styles from "./Modal.module.css";
import { FaTimes, FaWhatsapp } from "react-icons/fa";

interface Preco {
  nomeservico: string;
  precificacao: number;
}

interface ModalProps {
  profissional: {
    id: number;
    nome?: string;
    categoria?: string;
    descricao?: string;
    telefone?: string;
    precos?: Preco[]; // Recebe os preços
    imagem_url?: string; // Foto principal
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
      try {
        // Busca o portfólio e as avaliações via API
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

    // ✨ A MAGIA DA AVALIAÇÃO: Guarda a intenção de contacto para mostrar o Modal depois
    localStorage.setItem("@ProConnect:avaliar", JSON.stringify({
      id: profissional.id,
      nome: profissional.nome || "Profissional"
    }));

    // Abre o WhatsApp
    const numeroLimpo = profissional.telefone.replace(/\D/g, "");
    const mensagem = encodeURIComponent(`Olá, vi o seu perfil no ProConnect e gostaria de pedir um orçamento.`);
    window.open(`https://wa.me/55${numeroLimpo}?text=${mensagem}`, "_blank");

    // ✨ CORREÇÃO: Fecha o modal do profissional para não tapar a avaliação quando o cliente voltar!
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className={styles.header}>
           <h2>{profissional.nome || "Profissional"}</h2>
           <span className={styles.badgeCategoria}>{profissional.categoria}</span>
        </div>
        
        <div className={styles.info}>
          <p className={styles.descricao}>{profissional.descricao}</p>
        </div>

        {/* SEÇÃO DE PREÇOS (TABELA) */}
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

        {/* SEÇÃO PORTFÓLIO */}
        <div className={styles.section}>
          <h3>Portfólio</h3>
          {loading ? (
            <p>A carregar galeria...</p>
          ) : fotos.length > 0 ? (
            <div className={styles.gridPortfolio}>
              {fotos.map(f => (
                <div key={f.id} className={styles.fotoWrapper} onClick={() => setFotoAmpliada(f.url)}>
                  <img src={f.url} className={styles.foto} alt="Trabalho" />
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noData}>Nenhuma foto disponível.</p>
          )}
        </div>

        <button onClick={handleContatoClick} className={styles.btnWhats}>
          <FaWhatsapp style={{ fontSize: "1.2rem" }} /> Falar no WhatsApp
        </button>

        {/* LIGHTBOX (Abre a imagem em ecrã inteiro) */}
        {fotoAmpliada && (
          <div className={styles.lightbox} onClick={() => setFotoAmpliada(null)}>
            <button className={styles.fecharLightbox} aria-label="Fechar">
              <FaTimes />
            </button>
            <img src={fotoAmpliada} alt="Ampliada" className={styles.imagemAmpliada} />
          </div>
        )}
      </div>
    </div>
  );
}