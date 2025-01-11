import Image from "next/image";
import  styles  from "../styles/page.module.css";

export default function Home() {
  return (
    <div className="{styles.body}">
      <h1 className="{styles.titulo}">ProConnect</h1>
      <h2 className="{styles.texto}">Simplifique a busca porserviços e profissionais com a plataforma mais direta e transparente do mercado</h2>

    </div>
  );
}
