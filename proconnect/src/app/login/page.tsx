"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/service/authService";
import styles from "./Login.module.css";
import { LoginPayload } from "@/interfaces/LoginProps";
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: LoginPayload = { email, senha };

    try {
      const token = await loginUser(payload);
      localStorage.setItem("token", token);
      alert("Login bem-sucedido!");
      router.push("/cadastro-produto");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <Image src="/logo.png" alt="ProConnect" className={styles.logo} width={1000} height={1000} />
        </div>

        <div className={styles.formSection}>
          <h1>Entrar</h1>
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
              disabled={loading}
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
              disabled={loading}
            />

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Carregando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
