"use client";

import React, { useState, useEffect } from "react";
import styles from "./ModalServico.module.css"; // Importe o CSS para estilizar o modal

interface Comment {
  name: string;
  rating: number;
  text: string;
}

const ModalServico: React.FC = () => {
  const [rating, setRating] = useState<number>(0); // Avaliação do usuário
  const [feedback, setFeedback] = useState<string>(""); // Feedback do usuário
  const [comments, setComments] = useState<Comment[]>([
    { name: "Maria", rating: 5, text: "Excelente atendimento! A Joana foi super atenciosa e meu cabelo ficou incrível. Recomendo demais!" },
    { name: "Anonymous", rating: 4, text: "Fiz progressiva e achei que não durou tanto quanto esperava, mas o atendimento foi bom." },
  ]);

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  };

  const handleRatingChange = (stars: number) => {
    setRating(stars);
  };

  const handleSubmitFeedback = () => {
    if (feedback) {
      setComments([
        ...comments,
        { name: "Você", rating, text: feedback }
      ]);
      setFeedback("");
      setRating(0);
    }
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <img src="/path-to-your-logo.png" alt="Logo" className={styles.logo} />
          <h2>Hair Salon</h2>
          <p className={styles.category}>Cabeleireira</p>
          <p className={styles.location}>São Paulo - SP</p>
          <div className={styles.rating}>
            {/* Exibindo estrelas */}
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= rating ? styles.filledStar : styles.emptyStar}
                onClick={() => handleRatingChange(star)}
              >
                ★
              </span>
            ))}
            <p>{rating} de 5</p>
          </div>
        </div>
        <div className={styles.about}>
          <h3>Sobre</h3>
          <p>Especialista em cortes modernos, coloração e tratamentos capilares. Atendimento personalizado para realçar a sua beleza.</p>
        </div>
        <div className={styles.specifications}>
          <h3>Especificação</h3>
          <ul>
            <li>Cortes femininos e masculinos</li>
            <li>Escova progressiva e hidratação</li>
            <li>Atendimento a domicílio</li>
          </ul>
        </div>
        <div className={styles.feedbackSection}>
          <h3>O que você achou desse serviço?</h3>
          <textarea
            placeholder="Escreva aqui sua avaliação ou feedback"
            value={feedback}
            onChange={handleFeedbackChange}
            className={styles.feedbackInput}
          />
          <button onClick={handleSubmitFeedback} className={styles.submitFeedback}>Enviar</button>
        </div>
        <div className={styles.previousComments}>
          <h3>Avaliações anteriores</h3>
          {comments.map((comment, index) => (
            <div key={index} className={styles.comment}>
              <p className={styles.commentAuthor}>{comment.name}</p>
              <div className={styles.commentRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={star <= comment.rating ? styles.filledStar : styles.emptyStar}>
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
          <button>Entre em contato</button>
        </div>
      </div>
    </div>
  );
};

export default ModalServico;
