"use client";

import { useState } from "react";
import styles from "./Cadusuario.module.css";

export default function CadastroUsuario() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ nome, email, telefone, estado, cidade, endereco, senha });
  };

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <img src="/logo.png" alt="ProConnect" className={styles.logo} />
        </div>

        <div className={styles.formSection}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="nome" className={styles.label}>
              Nome
            </label>
            <input
              type="text"
              id="nome"
              className={styles.inputField}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

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

            <label htmlFor="telefone" className={styles.label}>
              Telefone
            </label>
            <input
              type="tel"
              id="telefone"
              className={styles.inputField}
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />

            <label htmlFor="estado" className={styles.label}>
              Estado
            </label>
            <input
              type="text"
              id="estado"
              className={styles.inputField}
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            />

            <label htmlFor="cidade" className={styles.label}>
              Cidade
            </label>
            <input
              type="text"
              id="cidade"
              className={styles.inputField}
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />

            <label htmlFor="endereco" className={styles.label}>
              Endereço
            </label>
            <input
              type="text"
              id="endereco"
              className={styles.inputField}
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
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
              Cadastrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}