import styles from "./Cadproduto.module.css";

export default function Cadproduto() {
  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <p className={styles.logoText}>Adicione uma foto da logo do seu serviço</p>
          <input type="file" className={styles.inputFile} />
        </div>

        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <label htmlFor="nome" className={styles.label}>Nome da sua marca</label>
            <input type="text" id="nome" className={styles.inputField} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="categoria" className={styles.label}>Categoria</label>
            <select id="categoria" className={styles.inputField}>
              <option value="Alimento">Alimento</option>
              <option value="Beleza">Beleza</option>
              <option value="Saúde">Saúde</option>
              <option value="Obra">Obra</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="localizacao" className={styles.label}>Localização</label>
            <select id="localizacao" className={styles.inputField}>
              <option value="Santo Antonio">Santo Antonio</option>
              <option value="Dom Expedito">Dom Expedito</option>
              <option value="Sussuapara">Sussuapara</option>
              <option value="Picos">Picos</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input type="email" id="email" className={styles.inputField} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="telefone" className={styles.label}>Telefone</label>
            <input type="tel" id="telefone" className={styles.inputField} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="instagram" className={styles.label}>Instagram</label>
            <input type="url" id="instagram" className={styles.inputField} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="linkedin" className={styles.label}>LinkedIn</label>
            <input type="url" id="linkedin" className={styles.inputField} />
          </div>

          <div className={styles.formGroupFullWidth}>
            <label htmlFor="descricao" className={styles.label}>Descrição</label>
            <input type="text" id="descricao" className={styles.inputField} />
          </div>

          <div className={styles.formGroupFullWidth}>
            <label htmlFor="preco" className={styles.label}>Especificação de Preço</label>
            <input type="text" id="preco" className={styles.inputField} />
          </div>

          <div className={styles.formGroupFullWidth}>
            <input type="submit" value="Finalizar Cadastro" className={styles.submitButton} />
          </div>
        </div>
      </div>
    </div>
  );
}
