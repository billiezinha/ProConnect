"use client";

import styles from "./Cadproduto.module.css";
import { useState } from "react";

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
            {logoPreview ? (
              <img src={logoPreview} alt="Logo Preview" className={styles.logoPreview} />
            ) : (
              <div className={styles.logoPlaceholder}>
                <i className={styles.cameraIcon}></i>
              </div>
            )}
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

          <label htmlFor="localizacao" className={styles.label}>Localização</label>
          <select id="localizacao" className={styles.inputField}>
            <option value="Santo Antonio">Santo Antonio</option>
            <option value="Dom Expedito">Dom Expedito</option>
            <option value="Sussuapara">Sussuapara</option>
            <option value="Picos">Picos</option>
          </select>

          <label htmlFor="email" className={styles.label}>Email</label>
          <input type="email" id="email" className={styles.inputField} />

          <label htmlFor="telefone" className={styles.label}>Telefone</label>
          <input type="tel" id="telefone" className={styles.inputField} />

          <label htmlFor="instagram" className={styles.label}>Instagram</label>
          <input type="url" id="instagram" className={styles.inputField} />

          <label htmlFor="linkedin" className={styles.label}>LinkedIn</label>
          <input type="url" id="linkedin" className={styles.inputField} />

          <label htmlFor="descricao" className={styles.label}>Descrição</label>
          <input type="text" id="descricao" className={styles.inputField} />

          <label htmlFor="preco" className={styles.label}>Especificação de Preço</label>
          <input type="text" id="preco" className={styles.inputField} />

          <input type="submit" value="Finalizar Cadastro" className={styles.submitButton} />
        </div>
      </div>
    </div>
  );
}
