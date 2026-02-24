"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./Login.module.css";
import { loginUser } from "@/service/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast"; // Feedback moderno
import Cookies from 'js-cookie'; // Necessário para o Middleware funcionar

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await loginUser({ email, senha: password });
      
      // Salva no LocalStorage (para uso no Front-end/Client Components)
      localStorage.setItem("token", token);
      
      // Salva nos Cookies (para que o Middleware/Servidor consiga ler e proteger rotas)
      Cookies.set("token", token, { expires: 7 }); 

      toast.success("Bem-vindo de volta!");
      router.push("/Busca-profissionais");
    } catch (err) {
      toast.error("E-mail ou senha inválidos. Tente novamente.");
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
          <div className={styles.header}>
            <h1>Bem-vindo de volta!</h1>
            <p>Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                required
                disabled={loading}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Senha</label>
              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.showPasswordButton}
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className={styles.footerLink}>
            <p>
              Não tem uma conta? <Link href="/cadastro-usuario">Cadastre-se</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}