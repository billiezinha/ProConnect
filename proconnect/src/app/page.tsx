import Image from "next/image";
import styles from "./page.module.css";


export default function Home() {
  return (
    <div className={styles.body}>
      <h1 className={styles.titulo}>CONECTANDO</h1>
      <h1 className={styles.titulo2}>PROFISSIONAIS E CLIENTES</h1>
      <h2 className={styles.texto}>Simplifique a busca porserviços e profissionais com a plataforma mais direta e transparente do mercado</h2>
    
      <div>
    <button className={styles.butao}>ANUNCIE SEU SERVIÇO</button>
    <button className={styles.butao}>ENCONTRE PROFISSIONAIS</button>
      </div>
    </div>
  );
}
