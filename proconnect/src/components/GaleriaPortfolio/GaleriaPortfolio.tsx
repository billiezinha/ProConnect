"use client";
import { useEffect, useState } from "react";
import { getPortfolioByServico, PortfolioFoto } from "@/service/portfolioService";
import styles from "./GaleriaPortfolio.module.css";
import { FaTimes } from "react-icons/fa"; // Ícone de fechar

interface GaleriaPortfolioProps {
  servicoId: number;
}

export default function GaleriaPortfolio({ servicoId }: GaleriaPortfolioProps) {
  const [fotos, setFotos] = useState<PortfolioFoto[]>([]);
  const [loading, setLoading] = useState(true);
  
  // NOVO: Estado para controlar qual foto está aberta em ecrã inteiro
  const [fotoAmpliada, setFotoAmpliada] = useState<string | null>(null);

  useEffect(() => {
    async function carregarFotos() {
      try {
        const dados = await getPortfolioByServico(servicoId);
        setFotos(dados);
      } catch (error) {
        console.error("Erro ao carregar o portfólio:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarFotos();
  }, [servicoId]);

  if (loading) return <p className={styles.texto}>A carregar imagens...</p>;

  if (fotos.length === 0) {
    return <p className={styles.texto}>Este profissional ainda não adicionou fotos ao portfólio.</p>;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.titulo}>Portfólio de Trabalhos</h3>
      <div className={styles.grid}>
        {fotos.map((foto) => (
          <div 
            key={foto.id} 
            className={styles.imagemWrapper}
            onClick={() => setFotoAmpliada(foto.url)} // Ao clicar, define esta foto como a ampliada
          >
            <img 
              src={foto.url} 
              alt={`Trabalho do serviço ${servicoId}`} 
              className={styles.imagem}
            />
          </div>
        ))}
      </div>

      {/* NOVO: Modal / Lightbox para a foto ampliada */}
      {fotoAmpliada && (
        <div className={styles.lightbox} onClick={() => setFotoAmpliada(null)}>
          <button 
            className={styles.fecharLightbox} 
            onClick={() => setFotoAmpliada(null)}
            aria-label="Fechar imagem"
          >
            <FaTimes />
          </button>
          
          <img 
            src={fotoAmpliada} 
            alt="Foto ampliada" 
            className={styles.imagemAmpliada} 
            onClick={(e) => e.stopPropagation()} // Impede que clicar na imagem feche o modal
          />
        </div>
      )}
    </div>
  );
}