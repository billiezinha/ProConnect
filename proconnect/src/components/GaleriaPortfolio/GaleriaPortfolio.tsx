"use client";
import { useEffect, useState } from "react";
import { getPortfolioByServico, PortfolioFoto } from "@/service/portfolioService";
import styles from "./GaleriaPortfolio.module.css";

interface GaleriaPortfolioProps {
  servicoId: number;
}

export default function GaleriaPortfolio({ servicoId }: GaleriaPortfolioProps) {
  const [fotos, setFotos] = useState<PortfolioFoto[]>([]);
  const [loading, setLoading] = useState(true);

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
          <div key={foto.id} className={styles.imagemWrapper}>
            {/* Usamos a tag img normal para evitar problemas de domínio no Next.js numa fase inicial */}
            <img 
              src={foto.url} 
              alt={`Trabalho do serviço ${servicoId}`} 
              className={styles.imagem}
            />
          </div>
        ))}
      </div>
    </div>
  );
}