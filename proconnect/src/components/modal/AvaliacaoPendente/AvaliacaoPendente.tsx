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
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Função que verifica se há alguma avaliação pendente no localStorage
    const verificarPendente = () => {
      const salvo = localStorage.getItem("@ProConnect:avaliar");
      if (salvo) {
        setPendente(JSON.parse(salvo));
      }
    };

    // Verifica assim que a página carrega
    verificarPendente();

    // ✨ O SEGREDO: Verifica sempre que o utilizador VOLTA para a aba do site
    const handleFocus = () => {
      // Pequeno delay para a transição ser mais suave
      setTimeout(verificarPendente, 1500); 
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const fecharModal = () => {
    localStorage.removeItem("@ProConnect:avaliar");
    setPendente(null);
    setRating(0);
    setDescricao("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Por favor, dê uma nota de 1 a 5 estrelas.");
      return;
    }

    setLoading(true);
    try {
      await createAvaliacao({ 
        servicoId: pendente!.id, 
        star: rating, 
        descricao 
      });
      toast.success("Avaliação enviada com sucesso! Obrigado.");
      fecharModal(); // Limpa e fecha o modal
    } catch (error) {
      toast.error("Erro ao enviar avaliação. Tente novamente.");
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
        
        <h2>Como correu?</h2>
        <p>Voltou do WhatsApp com <strong>{pendente.nome}</strong>? Ajude a comunidade e avalie o atendimento!</p>

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
            placeholder="Deixe um comentário sobre o serviço (opcional)..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className={styles.textArea}
            rows={3}
          />

          <div className={styles.botoes}>
            <button type="button" onClick={fecharModal} className={styles.btnCancelar}>
              Avaliar depois
            </button>
            <button type="submit" disabled={loading} className={styles.btnEnviar}>
              {loading ? "A enviar..." : "Enviar Avaliação"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}