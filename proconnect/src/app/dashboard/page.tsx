"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { 
  FaUserCircle, FaStar, FaEye, FaWhatsapp, FaHeart, FaTrophy,
  FaComments, FaCheckCircle, FaChartLine, FaExclamationCircle,
  FaCalendarAlt, FaHistory, FaLock, FaArrowUp, FaArrowDown
} from "react-icons/fa";
import { getMe } from "@/service/userService";
import { getDashboard, DashboardResponse } from "@/service/dashboardService";
import type { User } from "@/interfaces/UserProps";
import { LoadingProfile } from "@/components/loading/Loading";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState<"hoje" | "semana" | "mes" | "ano">("mes");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const userData = await getMe();
        setUser(userData);

        if (userData.plano === "premium") {
          const dashboardData = await getDashboard(periodo);
          setData(dashboardData);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [periodo, router]);

  if (loading && !data) {
    return <LoadingProfile />;
  }

  // TELA DE BLOQUEIO SE NÃO FOR PREMIUM
  if (user?.plano !== "premium") {
    return (
      <div className={styles.deniedContainer}>
        <div className={styles.deniedCard}>
          <FaLock className={styles.deniedIcon} />
          <h2>Acesso Exclusivo Premium</h2>
          <p>
            O Dashboard do Profissional é uma ferramenta avançada disponível apenas para assinantes do plano Pro.
            Faça o upgrade agora para ter acesso a métricas, estatísticas e muito mais!
          </p>
          <button 
            className={styles.upgradeBtn}
            onClick={() => router.push("/#planos")}
          >
            <FaStar /> Assinar o Plano Pro
          </button>
          <br />
          <button 
            className={styles.backBtn}
            onClick={() => router.push("/perfil")}
          >
            Voltar para o meu Perfil
          </button>
        </div>
      </div>
    );
  }

  if (!data) return <p style={{ color: "white", textAlign: "center", marginTop: "100px" }}>Erro ao carregar dashboard.</p>;

  const { metricas, ranking, servicosMaisVisualizados, servicosMaisFavoritados, insights } = data;

  const renderVariacao = (variacao: number) => {
    if (variacao === 0) return <span className={styles.varNeutral}>0%</span>;
    return variacao > 0 ? (
      <span className={styles.varPositive}><FaArrowUp /> {variacao}%</span>
    ) : (
      <span className={styles.varNegative}><FaArrowDown /> {Math.abs(variacao)}%</span>
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.welcomeArea}>
            {user?.imagem ? (
              <img src={user.imagem} alt="Perfil" className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <FaUserCircle size={50} />
              </div>
            )}
            <div className={styles.welcomeText}>
              <h1>Olá, {user?.nome || "Profissional"}</h1>
              <p>Aqui está o resumo do seu desempenho.</p>
            </div>
          </div>
          
          <div className={styles.headerControls}>
            <div className={styles.proBadge}><FaStar /> Premium Ativo</div>
            <select 
              className={styles.periodoSelect}
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value as any)}
            >
              <option value="hoje">Hoje</option>
              <option value="semana">Esta Semana</option>
              <option value="mes">Este Mês</option>
              <option value="ano">Este Ano</option>
            </select>
          </div>
        </div>

        {/* Alertas / Insights */}
        {insights.length > 0 && (
          <div className={styles.insightsBox}>
            <h3><FaExclamationCircle /> Recomendações para melhorar seu perfil:</h3>
            <ul>
              {insights.map((insight, idx) => (
                <li key={idx}>{insight}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Resumo Geral (Cards Principais) */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <FaEye className={styles.statIcon} style={{ color: '#00BCD4', background: 'rgba(0,188,212,0.1)' }} />
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Visualizações do Perfil</div>
              <div className={styles.statValue}>{metricas.visualizacoes.atual}</div>
              <div className={styles.statVar}>{renderVariacao(metricas.visualizacoes.variacao)} em relação ao período anterior</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <FaWhatsapp className={styles.statIcon} style={{ color: '#4CAF50', background: 'rgba(76,175,80,0.1)' }} />
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Cliques no WhatsApp</div>
              <div className={styles.statValue}>{metricas.cliquesWhatsapp.atual}</div>
              <div className={styles.statVar}>{renderVariacao(metricas.cliquesWhatsapp.variacao)} em relação ao período anterior</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <FaHeart className={styles.statIcon} style={{ color: '#F44336', background: 'rgba(244,67,54,0.1)' }} />
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Favoritos Recebidos</div>
              <div className={styles.statValue}>{metricas.favoritos.atual}</div>
              <div className={styles.statVar}>{renderVariacao(metricas.favoritos.variacao)} em relação ao período anterior</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <FaStar className={styles.statIcon} style={{ color: '#FFC107', background: 'rgba(255,193,7,0.1)' }} />
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Média de Avaliações</div>
              <div className={styles.statValue}>{metricas.avaliacoes.media.toFixed(1)} <span style={{fontSize:'1rem', color:'#aaa'}}>({metricas.avaliacoes.total})</span></div>
              <div className={styles.statVar}>{renderVariacao(metricas.avaliacoes.variacao)} em relação ao período anterior</div>
            </div>
          </div>
        </div>

        {/* Detalhamento Intermediário */}
        <div className={styles.detailsGrid}>
          {/* Card: Serviços */}
          <div className={styles.sectionBox}>
            <h3 className={styles.sectionTitle}><FaCheckCircle /> Desempenho de Serviços</h3>
            <div className={styles.boxContent}>
              <div className={styles.infoRow}>
                <span>Total Realizados (Período)</span>
                <strong>{metricas.servicosRealizados.atual}</strong>
              </div>
              <div className={styles.infoRow}>
                <span>Agendados no Momento</span>
                <strong>{metricas.servicosRealizados.agendados}</strong>
              </div>
              <div className={styles.infoRow}>
                <span>Concluídos com Sucesso</span>
                <strong>{metricas.servicosRealizados.concluidos}</strong>
              </div>
              <div className={styles.infoRow} style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <span>Taxa de Conversão (Cliques vs Realizados)</span>
                <strong style={{ color: '#4CAF50' }}>{metricas.taxaConversao.taxa.toFixed(1)}%</strong>
              </div>
            </div>
          </div>

          {/* Card: Ranking & Histórico */}
          <div className={styles.sectionBox}>
            <h3 className={styles.sectionTitle}><FaTrophy /> Sua Posição</h3>
            <div className={styles.boxContent}>
              <div className={styles.rankingDisplay}>
                <span className={styles.rankNum}>#{ranking.posicao}</span>
                <span className={styles.rankTotal}>de {ranking.total} profissionais</span>
              </div>
              <p className={styles.rankPercentil}>Você está entre os <strong>top {ranking.percentil}%</strong> da plataforma.</p>
              
              <div className={styles.infoRow} style={{ marginTop: '20px' }}>
                <span><FaHistory /> Avaliação Histórica (Sempre)</span>
                <strong><FaStar style={{color:'#ffc107', marginRight:'5px'}} />{metricas.avaliacaoGeral.media.toFixed(1)} ({metricas.avaliacaoGeral.total})</strong>
              </div>
              <div className={styles.infoRow}>
                <span><FaComments /> Clientes Únicos (Chat+Wpp)</span>
                <strong>{metricas.clientesUnicos.atual}</strong>
              </div>
              <div className={styles.infoRow}>
                <span><FaCalendarAlt /> Horário de Pico</span>
                <strong>{metricas.horarioDePico.hora}h ({metricas.horarioDePico.total} contatos)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Top Serviços */}
        <div className={styles.lowerSection}>
          <div className={styles.sectionBox}>
            <h3 className={styles.sectionTitle}>Top 5 - Serviços Mais Visualizados</h3>
            <div className={styles.listArea}>
              {servicosMaisVisualizados.length > 0 ? (
                servicosMaisVisualizados.map((svc, i) => (
                  <div key={svc.id || `view-${i}`} className={styles.listItem}>
                    <span className={styles.listIndex}>{i + 1}</span>
                    <span className={styles.listName}>{svc.nomeNegocio}</span>
                    <span className={styles.listScore}><FaEye /> {svc.total}</span>
                  </div>
                ))
              ) : (
                <p className={styles.emptyText}>Sem dados no período.</p>
              )}
            </div>
          </div>

          <div className={styles.sectionBox}>
            <h3 className={styles.sectionTitle}>Top 5 - Serviços Mais Favoritados</h3>
            <div className={styles.listArea}>
              {servicosMaisFavoritados.length > 0 ? (
                servicosMaisFavoritados.map((svc, i) => (
                  <div key={svc.id || `fav-${i}`} className={styles.listItem}>
                    <span className={styles.listIndex}>{i + 1}</span>
                    <span className={styles.listName}>{svc.nomeNegocio}</span>
                    <span className={styles.listScore}><FaHeart /> {svc.total}</span>
                  </div>
                ))
              ) : (
                <p className={styles.emptyText}>Sem dados no período.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
