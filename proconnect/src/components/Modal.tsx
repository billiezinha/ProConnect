"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "./Modal.module.css";
import { getServicoById } from "@/service/servicoService";
import { Servico } from "@/interfaces/ServicoProps";
import { FaStar, FaTimes } from "react-icons/fa";

// --- Componente de Estrelas Reutilizável ---
interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  interactive?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating, interactive = false }) => (
  <div className={styles.rating} aria-label={`Avaliação: ${rating} de 5 estrelas.`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <FaStar
        key={star}
        className={star <= rating ? styles.filledStar : styles.emptyStar}
        onClick={() => interactive && setRating?.(star)}
        role={interactive ? "button" : "img"}
        tabIndex={interactive ? 0 : -1}
        onKeyDown={(e) => interactive && (e.key === "Enter" || e.key === " ") && setRating?.(star)}
      />
    ))}
  </div>
);


// --- Componente Principal do Modal ---
interface Comment {
  name: string;
  rating: number;
  text: string;
}

type Props = {
  id: number;
  onClose: () => void;
};

const Modal: React.FC<Props> = ({ id, onClose }) => {
  const [servico, setServico] = useState<Servico | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([
    { name: "Maria", rating: 5, text: "Excelente atendimento! A Joana foi super atenciosa e meu cabelo ficou incrível. Recomendo demais!" },
    { name: "Anônimo", rating: 4, text: "Fiz progressiva e achei que não durou tanto quanto esperava, mas o atendimento foi bom." },
  ]);

  useEffect(() => {
    if (id) {
      getServicoById(id).then(setServico).catch(console.error);
    }
  }, [id]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmitFeedback = () => {
    if (feedback.trim() && userRating > 0) {
      setComments((prev) => [...prev, { name: "Você", rating: userRating, text: feedback.trim() }]);
      setFeedback("");
      setUserRating(0);
    } else {
      alert("Por favor, selecione uma avaliação e escreva um comentário.");
    }
  };

  if (!servico) {
    return (
      <div className={styles.modalOverlay} onClick={handleOverlayClick}>
        <div className={styles.modalContent} role="dialog">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  const { nomeNegocio, categoria, descricao, usuario, preco } = servico;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={styles.closeButton} aria-label="Fechar modal"><FaTimes /></button>
        
        <header className={styles.header}>
          <Image src="/Camera.jpg" alt="Logo do serviço" width={80} height={80} className={styles.logo} />
          <h2 id="modal-title">{nomeNegocio}</h2>
          <p className={styles.category}>{categoria?.nomeServico ?? "Sem categoria"}</p>
          {usuario && (
            <p className={styles.location}>
              {usuario.cidade}{usuario.cidade && usuario.estado ? " - " : ""}{usuario.estado}
            </p>
          )}
        </header>

        <section className={styles.section}>
          <h3>Sobre o Serviço</h3>
          <p>{descricao}</p>
        </section>

        <section className={styles.section}>
          <h3>Serviços e Preços</h3>
          <ul className={styles.priceList}>
            {(preco ?? []).map((p) => (
              <li key={p.id}>
                <span>{p.nomeservico}</span>
                <span className={styles.price}>R$ {Number(p.precificacao).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h3>Deixe sua Avaliação</h3>
          <div className={styles.feedbackForm}>
            <StarRating rating={userRating} setRating={setUserRating} interactive />
            <textarea
              placeholder="Conte como foi sua experiência..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className={styles.feedbackInput}
            />
            <button onClick={handleSubmitFeedback} className={styles.primaryButton}>
              Enviar Avaliação
            </button>
          </div>
        </section>

        <section className={styles.section}>
          <h3>Avaliações de Clientes</h3>
          <div className={styles.commentsList}>
            {comments.map((comment, index) => (
              <div key={index} className={styles.comment}>
                <div className={styles.commentHeader}>
                  <p className={styles.commentAuthor}>{comment.name}</p>
                  <StarRating rating={comment.rating} />
                </div>
                <p className={styles.commentText}>{comment.text}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className={styles.footer}>
          <button onClick={onClose} className={styles.secondaryButton}>Fechar</button>
          {usuario?.telefone ? (
            // CORREÇÃO APLICADA AQUI
            <a href={`https://wa.me/55${usuario.telefone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className={styles.primaryButton}>
              Entrar em contato
            </a>
          ) : (
            <button className={styles.primaryButton} disabled>Contato indisponível</button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default Modal;