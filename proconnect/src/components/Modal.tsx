"use client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import styles from "./Modal.module.css";

interface ModalProps {
  profissional: {
    id: number;
    nome?: string;
    categoria?: string;
    descricao?: string;
    telefone?: string;
    mediaNota?: number | string;
  };
  onClose: () => void;
}

export default function Modal({ profissional, onClose }: ModalProps) {
  const router = useRouter();

  const handleContatoClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Para entrar em contato, faça login primeiro!");
      router.push("/login");
      return;
    }

    const mensagem = encodeURIComponent(`Olá, vi seu perfil no ProConnect e quero um orçamento.`);
    const telefone = profissional.telefone || "";
    
    if (telefone) {
      window.open(`https://wa.me/${telefone}?text=${mensagem}`, "_blank");
    } else {
      toast.error("Telefone não disponível para este profissional.");
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar modal">
          ×
        </button>
        
        <div className={styles.header}>
           <h2>{profissional.nome || "Profissional"}</h2>
           <p className={styles.categoria}>{profissional.categoria || "Categoria não informada"}</p>
        </div>
        
        <div className={styles.info}>
          <p className={styles.descricao}>{profissional.descricao || "Sem descrição disponível no momento."}</p>
          <span className={styles.nota}>
            ⭐ {profissional.mediaNota || "Novo na plataforma"}
          </span>
        </div>

        <button onClick={handleContatoClick} className={styles.btnWhats}>
          Ver WhatsApp e Pedir Orçamento
        </button>
      </div>
    </div>
  );
}