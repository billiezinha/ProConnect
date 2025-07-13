"use client";

import React, { useState, useEffect } from "react";
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
    { name: "Maria", rating: 5, text: "Excelente atendimento! A Joana foi super atenciosa e meu cabelo ficou incrível. Recomendo demais!" },
    { name: "Anonymous", rating: 4, text: "Fiz progressiva e achei que não durou tanto quanto esperava, mas o atendimento foi bom." },
  ]);

  useEffect(() => {
    if (!id || isNaN(id)) return;

    getServicoById(id)
      .then(setServico)
      .catch(console.error);
  }, [id]);

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  };

  const handleRatingChange = (stars: number) => {
    setRating(stars);
  };

  const handleSubmitFeedback = () => {
    if (feedback) {
      setComments([...comments, { name: "Você", rating, text: feedback }]);
      setFeedback("");
      setRating(0);
    }
  };

  if (!servico) return <div className={styles.modalContainer}><p>Carregando...</p></div>;

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <Image
            src="/Camera.jpg"
            alt="Logo"
            width={80}
            height={80}
            className={styles.logo}
          />
          <h2>{servico.nomeNegocio}</h2>
          <p className={styles.category}>{servico.categoria?.nomeServico}</p>
          <p className={styles.location}>{servico.localizacao?.cidade} - {servico.localizacao?.estado}</p>
          <div className={styles.rating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= rating ? styles.filledStar : styles.emptyStar}
                onClick={() => handleRatingChange(star)}
              >★</span>
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
            {servico.preco?.map((p, i) => (
              <li key={i}>✔ {p.nomeservico} - R$ {p.precificacao.toFixed(2)}</li>
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
              >★</span>
            ))}
          </div>
          <textarea
            placeholder="Escreva sua avaliação ou feedback"
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
                  <span key={star} className={star <= comment.rating ? styles.filledStar : styles.emptyStar}>★</span>
                ))}
                <p>{comment.rating} de 5</p>
              </div>
              <p>{comment.text}</p>
            </div>
          ))}
        </div>

        <div className={styles.contactButton}>
          <button>Entre em contato</button>
          <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
