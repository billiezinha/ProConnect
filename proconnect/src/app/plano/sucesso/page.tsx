"use client";
import { useRouter } from "next/navigation";
import styles from "../plano.module.css";
import { FaCheckCircle, FaRocket } from "react-icons/fa";
import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function SucessoPage() {
  const router = useRouter();

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffc107', '#4CAF50', '#8B2CF5']
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <FaCheckCircle className={styles.iconSuccess} />
        <h1>🎉 Parabéns!</h1>
        <p>Seu plano Premium foi ativado com sucesso.</p>
        <p className={styles.subtitle}>Agora você tem acesso a todos os recursos exclusivos da plataforma.</p>
        
        <button 
          className={styles.btnAction} 
          onClick={() => router.push("/dashboard")}
        >
          <FaRocket /> Ir para o Dashboard
        </button>
      </div>
    </div>
  );
}
