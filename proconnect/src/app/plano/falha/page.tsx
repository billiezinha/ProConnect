"use client";
import { useRouter } from "next/navigation";
import styles from "../plano.module.css";
import { FaTimesCircle, FaRedo } from "react-icons/fa";

export default function FalhaPage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <FaTimesCircle className={styles.iconError} />
        <h1>❌ Ops!</h1>
        <p>Algo deu errado no processamento do seu pagamento.</p>
        <p className={styles.subtitle}>Sua conta não foi cobrada. Por favor, tente novamente.</p>
        
        <button 
          className={styles.btnActionError} 
          onClick={() => router.push("/#planos")}
        >
          <FaRedo /> Tentar Novamente
        </button>
      </div>
    </div>
  );
}
