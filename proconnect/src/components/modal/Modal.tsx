"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getPortfolioByServico } from "@/service/portfolioService";
import { getAvaliacoesByServico, ResumoAvaliacao } from "@/service/avaliacaoService";
import api from "@/service/api"; // Importe sua instância do Axios
import styles from "./Modal.module.css";

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

  useEffect(() => {
    async function loadData() {
      try {
        // Busca portfólio e avaliações simultaneamente (ADS Performance)
        const [portfolioData, avaliacaoData] = await Promise.all([
          getPortfolioByServico(profissional.id),
          getAvaliacoesByServico(profissional.id)
        ]);
        setFotos(portfolioData);
        setResumo(avaliacaoData);
      } catch (error) {
        console.error("Erro ao carregar dados do modal");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [profissional.id]);

  const handleContatoClick = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Para entrar em contato, faça login primeiro!");
      router.push("/login");
      return;
    }

    try {
      // 1. Registra a intenção de serviço no seu Back-end
      // Isso permite que o usuário possa avaliar este profissional depois na página de "Meus Pedidos"
      await api.post("/servico-realizado", { 
        servicoId: profissional.id 
      });

      // 2. Formata o link do WhatsApp
      const numeroLimpo = profissional.telefone?.replace(/\D/g, "");
      const mensagem = encodeURIComponent(
        `Olá ${profissional.nome}, vi seu perfil no ProConnect e gostaria de um orçamento para ${profissional.categoria}.`
      );
      
      if (numeroLimpo) {
        window.open(`https://wa.me/55${numeroLimpo}?text=${mensagem}`, "_blank");
      } else {
        toast.error("Telefone não disponível.");
      }
    } catch (error) {
      console.error("Erro ao registrar contato no banco de dados");
      // Mesmo se falhar o registro, abrimos o Zap para não perder a conversão (IHC)
      const numeroLimpo = profissional.telefone?.replace(/\D/g, "");
      window.open(`https://wa.me/55${numeroLimpo}`, "_blank");
    }
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
            <p className={styles.loadingText}>Carregando galeria...</p>
          ) : fotos.length > 0 ? (
            <div className={styles.gridPortfolio}>
              {fotos.map(f => (
                <div key={f.id} className={styles.fotoWrapper}>
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
              <p className={styles.noData}>Seja o primeiro a avaliar este serviço!</p>
            )}
          </div>
        </div>

        <button onClick={handleContatoClick} className={styles.btnWhats}>
          Pedir Orçamento via WhatsApp
        </button>
      </div>
    </div>
  );
}