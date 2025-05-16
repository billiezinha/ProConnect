"use client";

import { useState } from "react";
import styles from "./Login.module.css";

export default function CadastroUsuario() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, senha });
  };

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <img src="/logo.png" alt="ProConnect" className={styles.logo} />
        </div>

        <div className={styles.formSection}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              className={styles.inputField}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="senha" className={styles.label}>
              Senha
            </label>
            <input
              type="password"
              id="senha"
              className={styles.inputField}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            <button type="submit" className={styles.submitButton}>
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
