import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.body}>
      <h1 className={styles.titulo}>CONECTANDO</h1>
      <h1 className={styles.titulo2}>PROFISSIONAIS E CLIENTES</h1>
      <h2 className={styles.textoPrincipal}>
        Simplifique a busca por serviços e profissionais com a plataforma mais direta e transparente do mercado
      </h2>

      <div>
        <a href="#footer">
          <button className={styles.butaoPrimary}>ANUNCIE SEU SERVIÇO</button>
        </a>
        <Link href="/Busca-profissionais">
          <button className={styles.butaoPrimary}>ENCONTRE PROFISSIONAIS</button>
        </Link>
      </div>

        {/* 🔥 NOVA SEÇÃO DE PLANOS */}
        <section className={styles.planos}>
          <h2 className={styles.tituloPlanos}>ESCOLHA O PLANO CERTO PRA VOCÊ</h2>
          <div className={styles.planosWrapper}>
            {/* Gratuito */}
            <div className={styles.cardPlano}>
              <h3 className={styles.planoTitulo}>Gratuito</h3>
              <ul className={styles.planoLista}>
                <li>✔️ Tenha Seu Perfil Visível Para Clientes</li>
                <li>✔️ Contato Direto</li>
                <li>✔️ Receber Avaliações</li>
              </ul>
              <button className={styles.botaoPlano}>Assinar Gratuito</button>
            </div>

            {/* Premium */}
            <div className={styles.cardPlano}>
              <h3 className={styles.planoTitulo}>Premium</h3>
              <ul className={styles.planoLista}>
                <li>✔️ Cadastre Seu Perfil</li>
                <li>✔️ Tenha Seu Perfil Visível Para Clientes</li>
                <li>✔️ Contato Direto</li>
                <li>✔️ Receber Avaliações</li>
                <li>✔️ Destaque Nos Resultados De Busca</li>
                <li>✔️ Prioridade Nas Indicações De Clientes</li>
                <li>✔️ Ver metricas de desempenho</li>
              </ul>
              <button className={styles.botaoPlano}>Assinar Premium</button>
            </div>
          </div>
        </section>

      {/* Seção de recursos */}
      <div className={styles.recursos}>
        <h1 className={styles.titulo3}>Por que escolher a ProConnect?</h1>
        <div className={styles.listaWrapper}>
          <ul className={styles.lista}>
            <li className={styles.itemLista}>Sem burocracias</li>
            <li className={styles.itemLista}>Contato direto com profissionais</li>
          </ul>
          <ul className={styles.lista}>
            <li className={styles.itemLista}>Planos acessíveis</li>
            <li className={styles.itemLista}>Sistema de avaliações confiável</li>
          </ul>
          <ul className={styles.lista}>
            <li className={styles.itemLista}>Maior visibilidade</li>
            <li className={styles.itemLista}>Controle total sobre serviços</li>
          </ul>
        </div>


        {/* Rodapé */}
        <div className={styles.footer}>
          <h1 className={styles.titulo4}>Pronto para começar?</h1>
          <h2 className={styles.textoFooterH2}>
            Junte-se a milhares de profissionais que já estão crescendo com a ProConnect.
          </h2>
          <div className={styles.buttonWrapper}>
            <Link href="/cadastro-usuario">
              <button className={styles.butaoSecondary}>Cadastre-se gratuitamente</button>
            </Link>
          </div>
          <footer id="footer" className={styles.rodape}>
            <h4 className={styles.textoFooter}>ProConnect</h4>
            <h4 className={styles.textoFooterDireitos}>© 2025 ProConnect. Todos os direitos reservados.</h4>
          </footer>
        </div>
      </div>
    </div>
  );
}
