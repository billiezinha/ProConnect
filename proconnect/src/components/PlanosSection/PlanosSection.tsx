"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./PlanosSection.module.css";
import { FaCheckCircle, FaStar, FaRocket, FaTimes, FaShieldAlt, FaExclamationTriangle } from "react-icons/fa";
import toast from "react-hot-toast";

import api from "@/service/api";

export default function PlanosSection() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro_mensal" | "pro_anual">("free");

  const handleCheckout = async (plan: "free" | "pro_mensal" | "pro_anual") => {
    if (plan === "free") {
      toast.success("Você já está no Plano Gratuito!");
      router.push("/perfil");
      return;
    }

    setLoading(true);
    
    try {
      const tipo = plan === "pro_anual" ? "anual" : "mensal";
      const response = await api.post("/assinatura/criar", { tipo });
      
      if (response.data && response.data.url) {
        toast.success("Redirecionando para o Pagamento Seguro...");
        window.location.href = response.data.url;
      } else {
        throw new Error("URL de pagamento não retornada.");
      }
    } catch (error: any) {
      if (error?.response?.status === 403) {
        toast.error("Você precisa anunciar um serviço antes de assinar o plano PRO.");
        setTimeout(() => router.push("/cadastro-servico"), 2500);
      } else {
        toast.error(error?.response?.data?.error || "Erro ao iniciar o pagamento. Tente novamente.");
      }
      setLoading(false);
    }
  };

  return (
    <section id="planos" className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <FaStar className={styles.starIcon} /> NOVIDADE
          </div>
          <h1 className={styles.title}>
            Eleve o seu perfil ao nível <span className={styles.highlight}>Pro</span>
          </h1>
          <p className={styles.subtitle}>
            Destaque-se na plataforma, ganhe mais clientes e tenha acesso a recursos exclusivos.
          </p>
        </div>

        <div className={styles.warningBox}>
          <FaExclamationTriangle size={20} />
          <span><strong>Importante:</strong> Você deve ter um serviço anunciado na plataforma para conseguir assinar o Premium.</span>
        </div>

        <div className={styles.cardsContainer}>
          {/* PLANO GRATUITO */}
          <div 
            className={`${styles.card} ${selectedPlan === "free" ? styles.cardActive : ""}`}
            onClick={() => setSelectedPlan("free")}
          >
            <div className={styles.cardHeader}>
              <h3>Plano Essencial</h3>
              <div className={styles.price}>
                <span className={styles.currency}>R$</span>
                <span className={styles.amount}>0</span>
                <span className={styles.period}>/mês</span>
              </div>
              <p className={styles.planDesc}>Ideal para quem está começando.</p>
            </div>
            <ul className={styles.featuresList}>
              <li><FaCheckCircle className={styles.checkIcon} /> Listagem padrão de serviços</li>
              <li><FaCheckCircle className={styles.checkIcon} /> Chat com clientes</li>
              <li><FaCheckCircle className={styles.checkIcon} /> Avaliações básicas</li>
              <li className={styles.disabled}><FaTimes className={styles.timesIcon} /> Sem selo de verificação Pro</li>
              <li className={styles.disabled}><FaTimes className={styles.timesIcon} /> Prioridade nas buscas</li>
            </ul>
            <button 
              className={styles.actionBtnOutline} 
              onClick={(e) => { e.stopPropagation(); handleCheckout("free"); }}
            >
              Plano Atual
            </button>
          </div>

          {/* PLANO PRO MENSAL */}
          <div 
            className={`${styles.card} ${styles.cardPro} ${selectedPlan === "pro_mensal" ? styles.cardProActive : ""}`}
            onClick={() => setSelectedPlan("pro_mensal")}
          >
            <div className={styles.popularBadge}>Mensal</div>
            <div className={styles.cardHeader}>
              <h3 className={styles.proTitle}><FaRocket /> ProConnect Mensal</h3>
              <div className={styles.price}>
                <span className={styles.currency}>R$</span>
                <span className={styles.amount}>29</span>
                <span className={styles.cents}>,90</span>
                <span className={styles.period}>/mês</span>
              </div>
              <p className={styles.planDesc}>Para profissionais que querem dominar o mercado mês a mês.</p>
            </div>
            <ul className={styles.featuresList}>
              <li><FaCheckCircle className={styles.checkIconPro} /> Destaque Ouro nas buscas</li>
              <li><FaCheckCircle className={styles.checkIconPro} /> Selo exclusivo de Profissional Pro</li>
              <li><FaCheckCircle className={styles.checkIconPro} /> Suporte Prioritário 24/7</li>
              <li><FaCheckCircle className={styles.checkIconPro} /> Notificações instantâneas de novos clientes</li>
              <li><FaCheckCircle className={styles.checkIconPro} /> Portfólio Ilimitado (Fotos/Vídeos)</li>
            </ul>
            <button 
              className={styles.actionBtnPro} 
              onClick={(e) => { e.stopPropagation(); handleCheckout("pro_mensal"); }}
              disabled={loading}
            >
              {loading ? "Aguarde..." : "Assinar Plano Mensal"}
            </button>
          </div>

          {/* PLANO PRO ANUAL */}
          <div 
            className={`${styles.card} ${styles.cardPro} ${selectedPlan === "pro_anual" ? styles.cardProActive : ""}`}
            onClick={() => setSelectedPlan("pro_anual")}
            style={{ transform: selectedPlan === 'pro_anual' ? 'scale(1.05)' : 'scale(1)', background: 'linear-gradient(135deg, #2a0845 0%, #6441A5 100%)' }}
          >
            <div className={styles.popularBadge} style={{ background: '#ffc107', color: '#000' }}>Mais Vantajoso</div>
            <div className={styles.cardHeader}>
              <h3 className={styles.proTitle} style={{ color: '#ffc107' }}><FaStar /> ProConnect Anual</h3>
              <div className={styles.price}>
                <span className={styles.currency}>R$</span>
                <span className={styles.amount}>269</span>
                <span className={styles.cents}>,90</span>
                <span className={styles.period}>/ano</span>
              </div>
              <p className={styles.planDesc}>Economize e garanta o topo das buscas o ano todo!</p>
            </div>
            <ul className={styles.featuresList}>
              <li><FaCheckCircle className={styles.checkIconPro} style={{ color: '#ffc107' }} /> Destaque Ouro nas buscas</li>
              <li><FaCheckCircle className={styles.checkIconPro} style={{ color: '#ffc107' }} /> Selo exclusivo de Profissional Pro</li>
              <li><FaCheckCircle className={styles.checkIconPro} style={{ color: '#ffc107' }} /> Suporte Prioritário 24/7</li>
              <li><FaCheckCircle className={styles.checkIconPro} style={{ color: '#ffc107' }} /> Notificações instantâneas de novos clientes</li>
              <li><FaCheckCircle className={styles.checkIconPro} style={{ color: '#ffc107' }} /> Portfólio Ilimitado (Fotos/Vídeos)</li>
            </ul>
            <button 
              className={styles.actionBtnPro} 
              onClick={(e) => { e.stopPropagation(); handleCheckout("pro_anual"); }}
              style={{ background: '#ffc107', color: '#000' }}
              disabled={loading}
            >
              {loading ? "Aguarde..." : "Assinar Plano Anual"}
            </button>
          </div>
        </div>

        <div className={styles.footerInfo}>
          <p><FaShieldAlt /> Pagamento 100% seguro via Mercado Pago. Cancele quando quiser.</p>
        </div>
      </div>
    </section>
  );
}
