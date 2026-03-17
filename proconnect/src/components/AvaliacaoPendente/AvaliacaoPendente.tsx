"use client";
import { useState, useEffect } from "react";
import { FaStar, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import { createAvaliacao } from "@/service/avaliacaoService";
import styles from "./AvaliacaoPendente.module.css";

export default function AvaliacaoPendente() {
  const [pendente, setPendente] = useState<{ id: number; nome: string } | null>(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState(""); // Alterado de 'descricao' para 'comentario'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verificarPendente = () => {
      const salvo = localStorage.getItem("@ProConnect:avaliar");
      if (salvo) {
        setPendente(JSON.parse(salvo));
      }
    };

    verificarPendente();

    const handleFocus = () => {
      setTimeout(verificarPendente, 1500); 
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const fecharModal = () => {
    localStorage.removeItem("@ProConnect:avaliar");
    setPendente(null);
    setRating(0);
    setComentario("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pendente) return;

    if (rating === 0) {
      toast.error("Por favor, selecione uma nota de 1 a 5 estrelas.");
      return;
    }

    setLoading(true);
    try {
      // ✅ CORREÇÃO: Enviando 'nota' e 'comentario' para coincidir com o serviço
      await createAvaliacao({ 
        servicoId: pendente.id, 
        nota: rating, 
        comentario: comentario 
      });

      toast.success("Avaliação enviada com sucesso!");
      fecharModal();
    } catch (error) {
      toast.error("Erro ao enviar avaliação.");
    } finally {
      setLoading(false);
    }
  };

  if (!pendente) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContent}>
        <button onClick={fecharModal} className={styles.closeBtn}>
          <FaTimes />
        </button>
        
        <h2>Como foi o atendimento?</h2>
        <p>Avaliando o serviço de <strong>{pendente.nome}</strong></p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                className={star <= (hover || rating) ? styles.starAtiva : styles.starInativa}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <FaStar />
              </button>
            ))}
          </div>

          <textarea
            placeholder="Deixe um comentário (opcional)..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className={styles.textArea}
            rows={3}
          />

          <div className={styles.botoes}>
            <button type="button" onClick={fecharModal} className={styles.btnCancelar}>
              Depois
            </button>
            <button type="submit" disabled={loading} className={styles.btnEnviar}>
              {loading ? "Enviando..." : "Enviar Avaliação"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}