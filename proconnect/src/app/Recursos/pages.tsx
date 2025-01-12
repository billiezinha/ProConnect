// Componentes React com estilos para corresponder à imagem fornecida
import styles from "./recursos.module.css";

export default function Recursos() {
  return (
    <div className={styles.body}>
      <h1 className={styles.titulo}>Por que escolher a ProConnect?</h1>
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
        <h1 className={styles.titulo2}>Pronto para começar?</h1>
        <h2 className={styles.texto}>Junte-se a milhares de profissionais que já estão crescendo com a ProConnect.</h2>

        <div className={styles.buttonWrapper}>
          <button className={styles.butao}>Cadastre-se gratuitamente</button>
        </div>

        <footer className={styles.rodape}>
          <h4 className={styles.textoFooter}>ProConnect</h4>
          <h4 className={styles.textoFooterDireitos}>© 2025 ProConnect. Todos os direitos reservados.</h4>
        </footer>
      </div>
    </div>
  );
}
