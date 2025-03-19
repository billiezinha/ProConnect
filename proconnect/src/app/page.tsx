import Link from 'next/link';
import styles from "./page.module.css";
import ImageUploader from '@/components/ImageUploader';

export default function Home() {
  return (

  //   <div>
  //   <h1>Upload de Imagem para Firebase</h1>
  //   <ImageUploader />
  // </div>
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
