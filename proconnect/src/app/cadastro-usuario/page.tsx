"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createUser } from "@/service/userService";
import { loginUser } from "@/service/authService"; // Importa a função de login
import { CreateUserPayload } from "@/interfaces/UserProps";
import styles from "./Cadusuario.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type FormData = CreateUserPayload & { confirmarSenha?: string };

export default function CadastroUsuarioPage() {
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    telefone: "",
    estado: "",
    cidade: "",
    endereco: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNextStep = () => {
    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }
    if (formData.senha.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handlePrevStep = () => {
    setError("");
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload: CreateUserPayload = {
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      telefone: formData.telefone,
      estado: formData.estado,
      cidade: formData.cidade,
      endereco: formData.endereco,
    };

    try {
      // 1. Cria o usuário
      await createUser(payload);

      // 2. Faz o login automático
      const token = await loginUser({ email: payload.email, senha: payload.senha });
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }

      // 3. Redireciona para o cadastro de serviço
      alert("Cadastro realizado com sucesso! Agora, cadastre seu primeiro serviço.");
      router.push("/cadastro-servico");

    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Não foi possível completar o cadastro.";
      setError(errorMessage);
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
          <div className={styles.formHeader}>
            <h1>{step === 1 ? "Crie a sua Conta" : "Complete seu Perfil"}</h1>
            <span className={styles.stepIndicator}>Passo {step} de 2</span>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <p className={styles.error}>{error}</p>}

            {step === 1 && (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor="nome">Nome Completo</label>
                  <input id="nome" type="text" value={formData.nome} onChange={handleChange} required disabled={loading} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" value={formData.email} onChange={handleChange} required disabled={loading} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="senha">Senha</label>
                  <div className={styles.passwordWrapper}>
                    <input id="senha" type={showPassword ? "text" : "password"} value={formData.senha} onChange={handleChange} required disabled={loading} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.showPasswordButton}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="confirmarSenha">Confirmar Senha</label>
                  <div className={styles.passwordWrapper}>
                    <input id="confirmarSenha" type={showConfirmPassword ? "text" : "password"} value={formData.confirmarSenha} onChange={handleChange} required disabled={loading} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={styles.showPasswordButton}>
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <button type="button" onClick={handleNextStep} className={styles.submitButton} disabled={loading}>
                  Próximo
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor="telefone">Telefone</label>
                  <input id="telefone" type="tel" value={formData.telefone} onChange={handleChange} required disabled={loading} placeholder="(00) 00000-0000" />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="estado">Estado</label>
                  <input id="estado" type="text" value={formData.estado} onChange={handleChange} required disabled={loading} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="cidade">Cidade</label>
                  <input id="cidade" type="text" value={formData.cidade} onChange={handleChange} required disabled={loading} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="endereco">Endereço</label>
                  <input id="endereco" type="text" value={formData.endereco} onChange={handleChange} required disabled={loading} placeholder="Rua, número, complemento…" />
                </div>
                <div className={styles.buttonContainer}>
                  <button type="button" onClick={handlePrevStep} className={`${styles.submitButton} ${styles.secondaryButton}`} disabled={loading}>
                    Voltar
                  </button>
                  <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? "Finalizando..." : "Finalizar Cadastro"}
                  </button>
                </div>
              </>
            )}
          </form>

          <div className={styles.loginLink}>
            Já tem uma conta? <Link href="/login">Faça login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}