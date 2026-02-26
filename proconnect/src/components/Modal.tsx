"use client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import styles from "./Modal.module.css";

// Definimos a interface para garantir que o TypeScript entenda os dados
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

    // Verificação de autenticação para segurança de IHC
    if (!token) {
      toast.error("Para entrar em contato, faça login primeiro!");
      router.push("/login");
      return;
    }

    // Log de interesse (Simulação de registro de leads)
    console.log(`Cliente interessado em: ${profissional.nome}`);

    // REDIRECIONAMENTO WHATSAPP
    // O uso do optional chaining (?) e fallback garante que o código não quebre
    const mensagem = encodeURIComponent(`Olá, vi seu perfil no ProConnect e quero um orçamento.`);
    const telefone = profissional.telefone || "";
    
    if (telefone) {
      window.open(`https://wa.me/${telefone}?text=${mensagem}`, "_blank");
    } else {
      toast.error("Telefone não disponível para este profissional.");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar modal">
          ×
        </button>
        
        {/* Renderização condicional para evitar campos vazios */}
        <h2>{profissional.nome || "Profissional"}</h2>
        <p className={styles.categoria}>{profissional.categoria || "Categoria não informada"}</p>
        
        <div className={styles.info}>
          <p>{profissional.descricao || "Sem descrição disponível no momento."}</p>
          <span className={styles.nota}>
            ⭐ {profissional.mediaNota || "Novo na plataforma"}
          </span>
        </div>

        {/* Botão com call-to-action direto */}
        <button onClick={handleContatoClick} className={styles.btnWhats}>
          Ver WhatsApp e Pedir Orçamento
        </button>
      </div>
    </div>
  );
}