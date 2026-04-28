"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaCreditCard, FaStar, FaExclamationCircle } from "react-icons/fa";
import styles from "./page.module.css";
import { getMe } from "@/service/userService";
import type { User } from "@/interfaces/UserProps";
import { LoadingProfile } from "@/components/loading/Loading";

export default function GerenciarAssinaturaPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const userData = await getMe();
        if (userData.plano !== "premium") {
          router.replace("/perfil"); // Se não for premium, não tem o que gerenciar
          return;
        }
        setUser(userData);
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  if (loading) return <LoadingProfile />;
  if (!user) return null;

  const handleManagePortal = () => {
    // Aqui redirecionaria para o portal do cliente do Mercado Pago ou Stripe
    alert("Redirecionando para o portal de pagamento (Em desenvolvimento)");
  };

  const handleCancelSubscription = () => {
    if (confirm("Tem certeza que deseja cancelar sua assinatura? Você perderá todos os benefícios premium ao final do ciclo de cobrança atual.")) {
      alert("Solicitação de cancelamento enviada (Em desenvolvimento)");
    }
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push("/perfil")}>
          <FaArrowLeft /> Voltar
        </button>
        <h1><FaCreditCard /> Gerenciar Assinatura</h1>
      </header>
      
      <main className={styles.content}>
        <div className={styles.card}>
          <div className={styles.planInfo}>
            <div className={styles.planHeader}>
              <div className={styles.planBadge}><FaStar /> Plano Premium</div>
              <span className={styles.statusActive}>Ativo</span>
            </div>
            
            <div className={styles.planDetails}>
              <p><strong>Valor:</strong> R$ 49,90 / mês</p>
              <p><strong>Próxima cobrança:</strong> 28/05/2026</p>
              <p><strong>Método de Pagamento:</strong> Cartão de Crédito final 4321</p>
            </div>
          </div>

          <div className={styles.benefitsBox}>
            <h3>Benefícios Ativos:</h3>
            <ul>
              <li>Selo Dourado (Profissional PRO)</li>
              <li>Prioridade nos resultados de busca</li>
              <li>Dashboard exclusivo com métricas e insights</li>
              <li>Fotos ilimitadas no portfólio</li>
            </ul>
          </div>

          <div className={styles.actionsBox}>
            <button className={styles.portalBtn} onClick={handleManagePortal}>
              <FaCreditCard /> Atualizar Forma de Pagamento
            </button>
            <button className={styles.cancelBtn} onClick={handleCancelSubscription}>
              <FaExclamationCircle /> Cancelar Assinatura
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
