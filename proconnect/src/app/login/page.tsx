"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./Login.module.css";
import { loginUser, forgotPassword } from "@/service/authService";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiArrowLeft } from "react-icons/hi";
import { FaUserTie, FaHandshake, FaBriefcase, FaNetworkWired } from "react-icons/fa";
import toast from "react-hot-toast"; 
import Cookies from 'js-cookie'; 

export default function LoginPage() {
  const router = useRouter();
  
  // Estados do Formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Estado para trocar entre "Login" e "Recuperar Senha"
  const [isForgotMode, setIsForgotMode] = useState(false);

  // Lógica de Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await loginUser({ email, senha: password });
      localStorage.setItem("token", token);
      Cookies.set("token", token, { expires: 7 }); 
      toast.success("Bem-vindo de volta!");
      router.push("/Busca-profissionais");
    } catch {
      toast.error("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  // Lógica de Recuperação (Sincronizada com seu Back-end)
  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor, insira seu e-mail.");
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success("E-mail de recuperação enviado!");
      setIsForgotMode(false); // Volta para o login após enviar
    } catch {
      toast.error("Erro ao processar solicitação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        
        {/* LADO ESQUERDO: VISUAL COM ÍCONES DE CONEXÃO */}
        <div className={styles.visualSection}>
          <div className={styles.floatingIcons}>
            <FaUserTie className={styles.icon1} />
            <FaHandshake className={styles.icon2} />
            <FaBriefcase className={styles.icon3} />
            <FaNetworkWired className={styles.icon4} />
          </div>
          <div className={styles.visualContent}>
            <Image src="/logo.png" alt="ProConnect" width={280} height={280} priority className={styles.logoVisual} />
            <h1>Conectando <br/> Picos e Região</h1>
            <p>A maior vitrine de profissionais e clientes do Piauí.</p>
          </div>
        </div>

        {/* LADO DIREITO: FORMULÁRIO DINÂMICO */}
        <div className={styles.formSection}>
          <div className={styles.loginCard}>
            
            {!isForgotMode ? (
              /* MODO LOGIN */
              <>
                <div className={styles.header}>
                  <h1>Entrar</h1>
                  <p>Bem-vindo de volta! Insira seus dados.</p>
                </div>

                <form onSubmit={handleLogin}>
                  <div className={styles.formGroup}>
                    <label><HiOutlineMail /> E-mail</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="seuemail@exemplo.com" 
                      required 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <div className={styles.labelRow}>
                      <label><HiOutlineLockClosed /> Senha</label>
                      <button type="button" onClick={() => setIsForgotMode(true)} className={styles.forgotBtn}>
                        Esqueceu a senha?
                      </button>
                    </div>
                    <div className={styles.passwordWrapper}>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.toggleBtn}>
                        {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? "Acessando..." : "Fazer Login"}
                  </button>
                </form>
              </>
            ) : (
              /* MODO RECUPERAÇÃO DE SENHA */
              <>
                <div className={styles.header}>
                  <button onClick={() => setIsForgotMode(false)} className={styles.backBtn}>
                    <HiArrowLeft /> Voltar
                  </button>
                  <h1>Recuperar Senha</h1>
                  <p>Enviaremos um link de redefinição para o seu e-mail.</p>
                </div>

                <form onSubmit={handleRecovery}>
                  <div className={styles.formGroup}>
                    <label><HiOutlineMail /> E-mail de cadastro</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="seuemail@exemplo.com" 
                      required 
                    />
                  </div>

                  <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? "Enviando..." : "Enviar Link de Recuperação"}
                  </button>
                </form>
              </>
            )}

            <p className={styles.registerText}>
              Ainda não tem conta? <Link href="/cadastro-usuario">Crie seu perfil</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}