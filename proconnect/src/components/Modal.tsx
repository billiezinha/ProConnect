"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./Modal.module.css";
import Image from "next/image";
import { getServicoById } from "@/service/servicoService";
import { Servico } from "@/interfaces/ServicoProps";

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
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([
    {
      name: "Maria",
      rating: 5,
      text: "Excelente atendimento! A Joana foi super atenciosa e meu cabelo ficou incrível. Recomendo demais!",
    },
    {
      name: "Anonymous",
      rating: 4,
      text: "Fiz progressiva e achei que não durou tanto quanto esperava, mas o atendimento foi bom.",
    },
  ]);

  useEffect(() => {
    if (!id || Number.isNaN(id)) return;
    getServicoById(id).then(setServico).catch(console.error);
  }, [id]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // fecha ao clicar no overlay (fora do modal)
    if (e.target === e.currentTarget) onClose();
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  };

  const handleRatingChange = (stars: number) => {
    setRating(stars);
  };

  const handleSubmitFeedback = () => {
    if (feedback.trim()) {
      setComments((prev) => [...prev, { name: "Você", rating, text: feedback.trim() }]);
      setFeedback("");
      setRating(0);
    }
  };

  if (!servico) {
    return (
      <div className={styles.modalContainer} onClick={handleOverlayClick} role="dialog" aria-modal="true">
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <p>Carregando...</p>
          <div className={styles.contactButton}>
            <button onClick={onClose}>Fechar</button>
          </div>
        </div>
      </div>
    );
  }

  const cidade = servico.usuario?.cidade ?? "";
  const estado = servico.usuario?.estado ?? "";

  return (
    <div
      className={styles.modalContainer}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo-servico"
      id="servico-detalhes"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <Image src="/Camera.jpg" alt="Logo" width={80} height={80} className={styles.logo} />
          <h2 id="modal-titulo-servico">{servico.nomeNegocio}</h2>
          <p className={styles.category}>{servico.categoria?.nomeServico ?? "Sem categoria"}</p>

          {(cidade || estado) && (
            <p className={styles.location}>
              {cidade}
              {cidade && estado ? " - " : ""}
              {estado}
            </p>
          )}

          <div className={styles.rating} aria-label="Sua avaliação deste serviço">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= rating ? styles.filledStar : styles.emptyStar}
                onClick={() => handleRatingChange(star)}
                role="button"
                tabIndex={0}
                aria-label={`Definir avaliação ${star} de 5`}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleRatingChange(star)}
              >
                ★
              </span>
            ))}
            <p>{rating} de 5</p>
          </div>
        </div>

        <div className={styles.about}>
          <h3>Sobre</h3>
          <p>{servico.descricao}</p>
        </div>

        <div className={styles.specifications}>
          <h3>Especificação</h3>
          <ul>
            {(servico.preco ?? []).map((p) => (
              <li key={p.id}>
                ✔ {p.nomeservico} – R{"$ "}
                {Number(p.precificacao).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.feedbackSection}>
          <h3>O QUE VOCÊ ACHOU DESSE SERVIÇO?</h3>
          <div className={styles.rating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= rating ? styles.filledStar : styles.emptyStar}
                onClick={() => handleRatingChange(star)}
                role="button"
                tabIndex={0}
                aria-label={`Definir avaliação ${star} de 5`}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleRatingChange(star)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            placeholder="Escreva sua avaliação ou feedback"
            value={feedback}
            onChange={handleFeedbackChange}
            className={styles.feedbackInput}
          />
          <button onClick={handleSubmitFeedback} className={styles.submitFeedback}>
            Enviar
          </button>
        </div>

        <div className={styles.previousComments}>
          <h3>Avaliações anteriores</h3>
          {comments.map((comment, index) => (
            <div key={index} className={styles.comment}>
              <p className={styles.commentAuthor}>{comment.name}</p>
              <div className={styles.commentRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= comment.rating ? styles.filledStar : styles.emptyStar}
                  >
                    ★
                  </span>
                ))}
                <p>{comment.rating} de 5</p>
              </div>
              <p>{comment.text}</p>
            </div>
          ))}
        </div>

        <div className={styles.contactButton}>
          {/* Se tiver telefone, vira um link clicável */}
          {servico.usuario?.telefone ? (
            <a href={`tel:${servico.usuario.telefone}`} className={styles.primaryButton}>
              Entre em contato
            </a>
          ) : (
            <button className={styles.primaryButton} disabled title="Telefone não informado">
              Entre em contato
            </button>
          )}
          <button onClick={onClose} className={styles.secondaryButton}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
