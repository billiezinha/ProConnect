"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getPortfolioByServico } from "@/service/portfolioService";
import styles from "./Modal.module.css";
import Image from "next/image";

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
  const [loadingFotos, setLoadingFotos] = useState(true);

  // Busca o portfólio do serviço ao abrir o modal
  useEffect(() => {
    async function loadPortfolio() {
      try {
        const data = await getPortfolioByServico(profissional.id);
        setFotos(data);
      } catch (error) {
        console.error("Erro ao carregar portfólio");
      } finally {
        setLoadingFotos(false);
      }
    }
    loadPortfolio();
  }, [profissional.id]);

  const handleContatoClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Para entrar em contato, faça login primeiro!");
      router.push("/login");
      return;
    }

    // Lógica para formatar o telefone (remove caracteres não numéricos)
    const numeroLimpo = profissional.telefone?.replace(/\D/g, "");
    const mensagem = encodeURIComponent(`Olá ${profissional.nome}, vi seu perfil no ProConnect e quero um orçamento.`);
    
    if (numeroLimpo) {
      window.open(`https://wa.me/55${numeroLimpo}?text=${mensagem}`, "_blank");
    } else {
      toast.error("Telefone não disponível para este profissional.");
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        
        <div className={styles.header}>
           <h2>{profissional.nome}</h2>
           <span className={styles.badgeCategoria}>{profissional.categoria}</span>
        </div>
        
        <div className={styles.info}>
          <p className={styles.descricao}>{profissional.descricao}</p>
          <div className={styles.metaInfo}>
            <span>⭐ {profissional.mediaNota || "Novo"}</span>
          </div>
        </div>

        {/* SEÇÃO DO PORTFÓLIO */}
        <div className={styles.portfolioSection}>
          <h3>Portfólio de Trabalhos</h3>
          {loadingFotos ? (
            <p>Carregando fotos...</p>
          ) : fotos.length > 0 ? (
            <div className={styles.gridPortfolio}>
              {fotos.map((foto) => (
                <div key={foto.id} className={styles.fotoWrapper}>
                  <img src={foto.url} alt="Trabalho do profissional" className={styles.foto} />
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noFotos}>Nenhuma foto cadastrada ainda.</p>
          )}
        </div>

        <button onClick={handleContatoClick} className={styles.btnWhats}>
          Conversar pelo WhatsApp
        </button>
      </div>
    </div>
  );
}