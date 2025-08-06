"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { loginUser } from "@/service/authService";
import { LoginPayload } from "@/interfaces/LoginProps";
import styles from "./Login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Estado para o erro

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Limpa erros anteriores

    const payload: LoginPayload = { email, senha };

    try {
      const token = await loginUser(payload);
      localStorage.setItem("token", token);
      alert("Login bem-sucedido!");
      router.push("/perfil");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message); // Define a mensagem de erro para a UI
        console.error(err.message);
      } else {
        setError("Ocorreu um erro desconhecido. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo ProConnect"
              width={200}
              height={200}
              priority
              className={styles.logo}
            />
          </Link>
        </div>

        <div className={styles.formSection}>
          <h1 className={styles.title}>Acesse sua Conta</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="seuemail@exemplo.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Exibe o erro aqui */}
            {error && <p className={styles.error}>{error}</p>}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "A carregar..." : "ENTRAR"}
            </button>
          </form>
          <div className={styles.register}>
            Não tem conta? <Link href="/cadastro-usuario">cadastre-se</Link>
          </div>
        </div>
      </div>
    </div>
  );
}