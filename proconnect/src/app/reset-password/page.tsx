"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/service/authService";
import styles from "./page.module.css";
import { HiOutlineLockClosed, HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  // Estado para controlar a visibilidade do segundo campo
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const passwordChecks = [
    { label: "8+ caracteres", met: novaSenha.length >= 8 },
    { label: "1 Maiúscula", met: /[A-Z]/.test(novaSenha) },
    { label: "1 Número", met: /\d/.test(novaSenha) },
    { label: "1 Especial", met: /[^a-zA-Z0-9]/.test(novaSenha) },
  ];

  const isPasswordSecure = passwordChecks.every(check => check.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Link de recuperação inválido.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword({ token, novaSenha });
      toast.success(response.message || "Senha atualizada com sucesso!");
      
      // REDIRECIONAMENTO SOLICITADO PARA A TELA DE LOGIN
      router.push("/login");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Erro ao redefinir.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h1>Redefinir Senha</h1>
      <p>Digite sua nova senha abaixo para acessar o ProConnect.</p>

      <form onSubmit={handleSubmit}>
        {/* CAMPO DE NOVA SENHA (Mantido) */}
        <div className={styles.formGroup}>
          <label><HiOutlineLockClosed /> Nova Senha</label>
          <div className={styles.passwordWrapper}>
            <input 
              type={showPass ? "text" : "password"} 
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
              placeholder="Digite a nova senha"
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className={styles.toggleBtn}>
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
          <div className={styles.passwordRules}>
            {passwordChecks.map((check, i) => (
              <span key={i} className={check.met ? styles.ruleMet : styles.ruleUnmet}>
                {check.met ? <HiOutlineCheckCircle /> : <HiOutlineXCircle />} {check.label}
              </span>
            ))}
          </div>
        </div>

        {/* CAMPO DE CONFIRMAÇÃO (CORRIGIDO PARA FICAR IGUAL AO PRIMEIRO) */}
        <div className={styles.formGroup}>
          <label><HiOutlineLockClosed /> Confirmar Senha</label>
          <div className={styles.passwordWrapper}>
            <input 
              type={showConfirmPass ? "text" : "password"} // Tipo controlado pelo novo estado
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
              placeholder="Repita a nova senha"
            />
            {/* Adicionado o botão de 'olhinho' no campo de baixo também */}
            <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className={styles.toggleBtn}>
              {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading || !isPasswordSecure}>
          {loading ? "Salvando..." : "Atualizar Senha"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className={styles.body}>
      <Suspense fallback={<div>Carregando...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}