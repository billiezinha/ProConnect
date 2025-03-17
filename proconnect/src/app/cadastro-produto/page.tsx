"use client";

import styles from "./Cadproduto.module.css";
import { useState } from "react";
import Link from "next/link";

export default function Cadproduto() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <p className={styles.logoText}>Adicione uma foto da logo do seu serviço</p>
          <div className={styles.logoWrapper}>
            <img
              src={logoPreview || "/Camera.jpg"}
              alt="Logo Preview"
              className={styles.logoPreview}
            />
            <input
              type="file"
              className={styles.inputFile}
              onChange={handleLogoChange}
              aria-label="Upload da logo"
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <label htmlFor="nome" className={styles.label}>Nome da sua marca</label>
          <input type="text" id="nome" className={styles.inputField} />

          <label htmlFor="categoria" className={styles.label}>Categoria</label>
          <select id="categoria" className={styles.inputField}>
            <option value="Alimento">Alimento</option>
            <option value="Beleza">Beleza</option>
            <option value="Saúde">Saúde</option>
            <option value="Obra">Obra</option>
          </select>

          <label htmlFor="telefone" className={styles.label}>Telefone</label>
          <input type="tel" id="telefone" className={styles.inputField} />

          <label htmlFor="descricao" className={styles.label}>Descrição</label>
          <input type="text" id="descricao" className={styles.inputField} />

          <Link href="/Busca-profissionais">
            <button className={styles.submitButton}>Finalizar Cadastro</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
