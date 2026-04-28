"use client";
import { useRouter } from "next/navigation";
import styles from "../plano.module.css";
import { FaHourglassHalf, FaArrowLeft } from "react-icons/fa";

export default function PendentePage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <FaHourglassHalf className={styles.iconPending} />
        <h1>⏳ Pagamento Pendente</h1>
        <p>Seu pagamento está sendo processado.</p>
        <p className={styles.subtitle}>
          Se você pagou via Pix ou Boleto, pode levar alguns minutos ou dias para confirmar.
          Assim que confirmado, seu plano será ativado automaticamente.
        </p>
        
        <button 
          className={styles.btnActionNeutral} 
          onClick={() => router.push("/perfil")}
        >
          <FaArrowLeft /> Voltar ao Meu Perfil
        </button>
      </div>
    </div>
  );
}
