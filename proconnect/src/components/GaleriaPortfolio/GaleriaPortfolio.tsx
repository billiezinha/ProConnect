"use client";
import { useState, useEffect } from "react";
import { getPortfolioByServico, deleteFotoPortfolio, PortfolioFoto } from "@/service/portfolioService";
import styles from "./GaleriaPortfolio.module.css";
import { FaTrash, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";

interface GaleriaPortfolioProps {
  servicoId: number;
  isOwner?: boolean;
}

export default function GaleriaPortfolio({ servicoId, isOwner }: GaleriaPortfolioProps) {
  const [fotos, setFotos] = useState<PortfolioFoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [fotoAmpliada, setFotoAmpliada] = useState<string | null>(null);

  useEffect(() => {
    carregarFotos();
  }, [servicoId]);

  const carregarFotos = async () => {
    try {
      const data = await getPortfolioByServico(servicoId);
      setFotos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, fotoId: number) => {
    e.stopPropagation(); // Evita abrir o modal da foto
    if (!confirm("Tem certeza que deseja excluir esta foto?")) return;
    try {
      await deleteFotoPortfolio(fotoId);
      toast.success("Foto removida!");
      carregarFotos();
    } catch (error) {
      toast.error("Erro ao remover foto.");
    }
  };

  if (loading) return <p className={styles.empty}>A carregar galeria...</p>;
  if (fotos.length === 0) return <p className={styles.empty}>Nenhuma foto adicionada.</p>;

  return (
    <>
      {/* Container dinâmico: se for dono usa a lista Preta, se for cliente usa grelha */}
      <div className={isOwner ? styles.editContainer : styles.grid}>
        {fotos.map(foto => (
          <div 
            key={foto.id} 
            className={isOwner ? styles.editCard : styles.imagemWrapper}
            onClick={() => !isOwner && setFotoAmpliada(foto.url)}
          >
            <img 
              src={foto.url} 
              alt="Trabalho do portfólio" 
              className={isOwner ? styles.editImage : styles.imagem} 
            />
            {/* Lixeira Vermelha do Modo de Edição */}
            {isOwner && (
              <button onClick={(e) => handleDelete(e, foto.id)} className={styles.deleteBtn} title="Excluir imagem">
                <FaTrash />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox para clientes expandirem a foto */}
      {fotoAmpliada && (
        <div className={styles.lightbox} onClick={() => setFotoAmpliada(null)}>
          <button className={styles.fecharLightbox} aria-label="Fechar">
            <FaTimes />
          </button>
          <img src={fotoAmpliada} alt="Foto ampliada" className={styles.imagemAmpliada} onClick={(e) => e.stopPropagation()}/>
        </div>
      )}
    </>
  );
}