"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getPortfolioByServico } from "@/service/portfolioService";
import { getAvaliacoesByServico, ResumoAvaliacao } from "@/service/avaliacaoService";
import styles from "./Modal.module.css"

export default function Modal({ profissional, onClose }: any) {
  const [fotos, setFotos] = useState<{ id: number; url: string }[]>([]);
  const [resumo, setResumo] = useState<ResumoAvaliacao | null>(null);
  const [loading, setLoading] = useState(true);

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
        console.error("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [profissional.id]);

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
          <div className={styles.ratingHeader}>
            <span className={styles.starMain}>⭐ {resumo?.mediaEstrelas?.toFixed(1) || "Novo"}</span>
            <span className={styles.totalAvaliacoes}>({resumo?.avaliacoes.length || 0} avaliações)</span>
          </div>
        </div>

        {/* SEÇÃO PORTFÓLIO */}
        <div className={styles.section}>
          <h3>Portfólio</h3>
          <div className={styles.gridPortfolio}>
            {fotos.map(f => <img key={f.id} src={f.url} className={styles.foto} alt="Portfólio" />)}
          </div>
        </div>

        {/* SEÇÃO AVALIAÇÕES */}
        <div className={styles.section}>
          <h3>O que dizem os clientes</h3>
          <div className={styles.listaAvaliacoes}>
            {resumo?.avaliacoes.length ? resumo.avaliacoes.map(av => (
              <div key={av.id} className={styles.cardAvaliacao}>
                <div className={styles.avHeader}>
                  <strong>{av.usuario.nome}</strong>
                  <span>{"⭐".repeat(av.star)}</span>
                </div>
                <p>{av.descricao}</p>
              </div>
            )) : <p className={styles.noData}>Nenhum comentário ainda.</p>}
          </div>
        </div>

        <button className={styles.btnWhats}>Pedir Orçamento</button>
      </div>
    </div>
  );
}