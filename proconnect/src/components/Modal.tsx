"use client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import styles from "./Modal.module.css";

export default function Modal({ profissional, onClose }) {
  const router = useRouter();

  const handleContatoClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Para entrar em contato, faça login primeiro!");
      router.push("/login");
      return;
    }

    // REGISTRO SILENCIOSO (Aqui você mandaria para o seu banco)
    console.log(`Cliente interessado em: ${profissional.nome}`);

    // REDIRECIONAMENTO WHATSAPP
    const mensagem = encodeURIComponent(`Olá, vi seu perfil no ProConnect e quero um orçamento.`);
    window.open(`https://wa.me/${profissional.telefone}?text=${mensagem}`, "_blank");
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        
        <h2>{profissional.nome}</h2>
        <p className={styles.categoria}>{profissional.categoria}</p>
        
        <div className={styles.info}>
          <p>{profissional.descricao}</p>
          <span className={styles.nota}>⭐ {profissional.mediaNota || "Novo"}</span>
        </div>

        {/* BOTÃO ÚNICO E DIRETO */}
        <button onClick={handleContatoClick} className={styles.btnWhats}>
          Ver WhatsApp e Pedir Orçamento
        </button>
      </div>
    </div>
  );
}