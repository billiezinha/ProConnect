import Link from 'next/link';
import styles from './page.module.css';
import { FaUserCircle } from 'react-icons/fa';

export default function Home() {
  return (
    <div className={styles.body}>
      {/* Cabeçalho Fixo */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <Link href="/" className={styles.logo}>
              ProConnect
            </Link>
            <nav className={styles.nav}>
              <Link href="/login" className={styles.loginLink}>
                <FaUserCircle className={styles.loginIcon} />
                <span>Login</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Seção Principal (Hero) */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <h1 className={styles.titulo}>CONECTANDO</h1>
          <h1 className={styles.titulo2}>PROFISSIONAIS E CLIENTES</h1>
          <h2 className={styles.textoPrincipal}>
            Simplifique a busca por serviços e profissionais com a plataforma mais direta e transparente do mercado.
          </h2>
          <div className={styles.botoesWrapper}>
            <a href="#planos" className={styles.butaoPrimary}>
              Anuncie seu Serviço
            </a>
            <Link href="/busca-profissionais" className={styles.butaoOutline}>
              Encontre Profissionais
            </Link>
          </div>
        </div>
      </main>

      {/* Seção de Planos */}
      <section id="planos" className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.tituloSecao}>Escolha o Plano Certo Para Você</h2>
          <div className={styles.planosWrapper}>
            {/* Card Gratuito */}
            <div className={styles.cardPlano}>
              <h3 className={styles.planoTitulo}>Gratuito</h3>
              <p className={styles.planoDescricao}>Ideal para começar a ter visibilidade na plataforma.</p>
              <ul className={styles.planoLista}>
                <li>✔️ Perfil Visível Para Clientes</li>
                <li>✔️ Contato Direto</li>
                <li>✔️ Receber Avaliações</li>
              </ul>
              <Link href="/cadastro-usuario" className={`${styles.botaoPlano} ${styles.botaoOutline}`}>
                Começar Agora
              </Link>
            </div>
            {/* Card Premium */}
            <div className={`${styles.cardPlano} ${styles.cardPlanoPremium}`}>
              <div className={styles.planoBadge}>Mais Popular</div>
              <h3 className={styles.planoTitulo}>Premium</h3>
              <p className={styles.planoDescricao}>Maximize seu alcance e destaque-se da concorrência.</p>
              <ul className={styles.planoLista}>
                <li>✔️ Todos os benefícios do Gratuito</li>
                <li>✔️ Destaque nos Resultados de Busca</li>
                <li>✔️ Prioridade em Indicações</li>
                <li>✔️ Análise de Desempenho do Perfil</li>
              </ul>
              <Link href="/assinatura" className={styles.botaoPlano}>
                Assinar Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Recursos */}
      <section className={`${styles.section} ${styles.recursos}`}>
        <div className={styles.container}>
          <h2 className={styles.tituloSecao}>Por que escolher a ProConnect?</h2>
          <div className={styles.listaWrapper}>
            <div className={styles.itemLista}>Sem burocracias</div>
            <div className={styles.itemLista}>Contato direto com profissionais</div>
            <div className={styles.itemLista}>Planos acessíveis</div>
            <div className={styles.itemLista}>Sistema de avaliações confiável</div>
            <div className={styles.itemLista}>Maior visibilidade</div>
            <div className={styles.itemLista}>Controle total sobre serviços</div>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer id="footer-section" className={styles.footer}>
        <div className={styles.container}>
          <h2 className={styles.titulo4}>Pronto para começar?</h2>
          <p className={styles.textoFooterH2}>
            Junte-se a milhares de profissionais que já estão crescendo com a ProConnect.
          </p>
          <div className={styles.buttonWrapper}>
            <Link href="/cadastro-usuario" className={styles.butaoSecondary}>
              Cadastre-se Gratuitamente
            </Link>
          </div>
          <div className={styles.rodapeInfo}>
            <p className={styles.textoFooter}>ProConnect</p>
            <p className={styles.textoFooterDireitos}>© 2024 ProConnect. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}