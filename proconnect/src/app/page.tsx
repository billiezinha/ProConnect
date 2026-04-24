import Link from 'next/link';
import styles from './page.module.css';
import { 
  FaRocket, 
  FaComments, 
  FaRegHandshake, 
  FaStar, 
  FaChartLine, 
  FaTools 
} from 'react-icons/fa';
import PlanosSection from '@/components/PlanosSection/PlanosSection';

export default function Home() {
  return (
    <div className={styles.body}>

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
            <Link href="/Busca-profissionais" className={styles.butaoOutline}>
              Encontre Profissionais
            </Link>
          </div>
        </div>
      </main>

      <PlanosSection />

      {/* Seção de Recursos */}
      <section className={`${styles.section} ${styles.recursos}`}>
        <div className={styles.container}>
          <h2 className={styles.tituloSecao}>Por que escolher a ProConnect?</h2>
          
          <div className={styles.gridRecursos}>
            <div className={styles.cardRecurso}>
              <FaRocket className={styles.iconRecurso} />
              <h3>Sem burocracias</h3>
              <p>Conecte-se rapidamente e sem intermediários desnecessários.</p>
            </div>

            <div className={styles.cardRecurso}>
              <FaComments className={styles.iconRecurso} />
              <h3>Contato direto</h3>
              <p>Fale diretamente com profissionais e clientes pelo WhatsApp.</p>
            </div>

            <div className={styles.cardRecurso}>
              <FaRegHandshake className={styles.iconRecurso} />
              <h3>Planos acessíveis</h3>
              <p>Opções que cabem no seu bolso para impulsionar sua carreira.</p>
            </div>

            <div className={styles.cardRecurso}>
              <FaStar className={styles.iconRecurso} />
              <h3>Avaliações</h3>
              <p>Sistema confiável para construir sua reputação no mercado.</p>
            </div>

            <div className={styles.cardRecurso}>
              <FaChartLine className={styles.iconRecurso} />
              <h3>Maior visibilidade</h3>
              <p>Apareça para quem realmente precisa do seu serviço na sua região.</p>
            </div>

            <div className={styles.cardRecurso}>
              <FaTools className={styles.iconRecurso} />
              <h3>Controle total</h3>
              <p>Gerencie seus anúncios e informações de forma simples e intuitiva.</p>
            </div>
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
        </div>
      </footer>
    </div>
  );
}