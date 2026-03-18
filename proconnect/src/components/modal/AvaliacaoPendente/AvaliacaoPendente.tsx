"use client";

import { useState, useEffect } from "react";
import { FaStar, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createAvaliacao } from "@/service/avaliacaoService";
import { criarServicoRealizado, confirmarServicoRealizado } from "@/service/servicoRealizadoService"; // ✅ Adicionado criarServicoRealizado
import styles from "./AvaliacaoPendente.module.css";

export default function AvaliacaoPendente() {
  const router = useRouter();
  const [pendente, setPendente] = useState<{ id: number; nome: string } | null>(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState("");
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
      // ✅ 1. TENTA CRIAR o registo do serviço primeiro (Caso o utilizador não tenha clicado no botão original)
      try {
        await criarServicoRealizado(pendente.id);
      } catch (err) {
        // Se já existir, a API pode dar erro, então ignoramos e seguimos em frente
        console.log("Serviço já estava registado, avançando para a confirmação...");
      }

      // ✅ 2. CONFIRMA o serviço (PATCH)
      await confirmarServicoRealizado(pendente.id, true);

      // ✅ 3. ENVIA a avaliação (POST)
      await createAvaliacao({ 
        servicoId: pendente.id, 
        nota: rating, 
        comentario: comentario 
      });
      
      toast.success("Avaliação enviada com sucesso!");
      fecharModal();
      router.refresh(); 
      
    } catch (error: any) {
      // Aqui mostramos a mensagem exata do Back-end, seja "Já avaliou" ou "Não realizou"
      const mensagemErro = error.response?.data?.message || error.message || "Erro ao enviar avaliação.";
      toast.error(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  if (!pendente) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContent}>
        <button onClick={fecharModal} className={styles.closeBtn} aria-label="Fechar">
          <FaTimes />
        </button>
        
        <h2 className={styles.title}>Como foi o atendimento?</h2>
        <p className={styles.subtitle}>
          Você entrou em contato com <strong>{pendente.nome}</strong>. 
          Deixe sua avaliação para ajudar outros usuários!
        </p>
        
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
            placeholder="Conte-nos brevemente como foi sua experiência (opcional)..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className={styles.textArea}
            rows={3}
          />
          
          <div className={styles.botoes}>
            <button type="button" onClick={fecharModal} className={styles.btnCancelar}>
              Avaliar depois
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