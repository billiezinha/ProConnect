"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createUser } from "@/service/userService";
import { loginUser } from "@/service/authService";
import { CreateUserPayload } from "@/interfaces/UserProps";
import styles from "./Cadusuario.module.css";
import { 
  HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, 
  HiOutlinePhone, HiOutlineLocationMarker, HiOutlineCheckCircle, 
  HiOutlineXCircle, HiOutlineUserGroup, HiOutlineBadgeCheck,
  HiOutlineSparkles, HiOutlineArrowLeft
} from "react-icons/hi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

type FormData = CreateUserPayload & { confirmarSenha?: string };

export default function CadastroUsuarioPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    nome: "", email: "", senha: "", confirmarSenha: "",
    telefone: "", estado: "", cidade: "", endereco: "",
  });

  const passwordChecks = [
    { label: "8+ caracteres", met: formData.senha.length >= 8 },
    { label: "1 Maiúscula", met: /[A-Z]/.test(formData.senha) },
    { label: "1 Número", met: /\d/.test(formData.senha) },
    { label: "1 Especial", met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.senha) },
  ];

  const isPasswordSecure = passwordChecks.every(check => check.met);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNextStep = () => {
    if (!isPasswordSecure) {
      toast.error("Sua senha não atende aos requisitos.");
      return;
    }
    if (formData.senha !== formData.confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUser(formData);
      const token = await loginUser({ email: formData.email, senha: formData.senha });
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }
      toast.success("Bem-vindo ao ProConnect!");
      router.push("/cadastro-servico");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        {/* SEÇÃO VISUAL REAJUSTADA */}
        <div className={styles.visualSection}>
          <div className={styles.floatingIcons}>
            <HiOutlineUserGroup className={styles.icon1} />
            <HiOutlineBadgeCheck className={styles.icon2} />
            <HiOutlineSparkles className={styles.icon3} />
            <HiOutlineUserGroup className={styles.icon4} />
          </div>
          <div className={styles.visualContent}>
            <Image src="/logo.png" alt="ProConnect" width={220} height={220} priority className={styles.logoVisual} />
            <div className={styles.textContent}>
              <h1>{step === 1 ? "Crie sua conta" : "Quase lá!"}</h1>
              <p>Junte-se à maior rede de profissionais de Picos e região.</p>
            </div>
          </div>
        </div>

        {/* SEÇÃO DO FORMULÁRIO */}
        <div className={styles.formSection}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <span className={styles.stepIndicator}>Passo {step} de 2</span>
              <h1>{step === 1 ? "Dados de Acesso" : "Informações de Contato"}</h1>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <div className={styles.stepAnimation}>
                  <div className={styles.formGroup}>
                    <label><HiOutlineUser /> Nome Completo</label>
                    <input id="nome" type="text" value={formData.nome} onChange={handleChange} required placeholder="Ex: Maria Silva" />
                  </div>
                  <div className={styles.formGroup}>
                    <label><HiOutlineMail /> Email</label>
                    <input id="email" type="email" value={formData.email} onChange={handleChange} required placeholder="seuemail@exemplo.com" />
                  </div>
                  <div className={styles.formGroup}>
                    <label><HiOutlineLockClosed /> Senha</label>
                    <div className={styles.passwordWrapper}>
                      <input id="senha" type={showPassword ? "text" : "password"} value={formData.senha} onChange={handleChange} required placeholder="Crie uma senha" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.toggleBtn}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
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
                  <div className={styles.formGroup}>
                    <label><HiOutlineLockClosed /> Confirmar Senha</label>
                    <div className={styles.passwordWrapper}>
                      <input id="confirmarSenha" type={showConfirmPassword ? "text" : "password"} value={formData.confirmarSenha} onChange={handleChange} required />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={styles.toggleBtn}>
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <button type="button" onClick={handleNextStep} className={styles.submitButton}>Próximo passo</button>
                </div>
              ) : (
                <div className={styles.stepAnimation}>
                  <div className={styles.formGroup}>
                    <label><HiOutlinePhone /> Telefone</label>
                    <input id="telefone" type="tel" value={formData.telefone} onChange={handleChange} required placeholder="(89) 90000-0000" />
                  </div>
                  <div className={styles.row}>
                    <div className={styles.formGroup}>
                      <label><HiOutlineLocationMarker /> Estado</label>
                      <input id="estado" type="text" value={formData.estado} onChange={handleChange} required placeholder="PI" />
                    </div>
                    <div className={styles.formGroup}>
                      <label><HiOutlineLocationMarker /> Cidade</label>
                      <input id="cidade" type="text" value={formData.cidade} onChange={handleChange} required placeholder="Picos" />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label><HiOutlineLocationMarker /> Endereço</label>
                    <input id="endereco" type="text" value={formData.endereco} onChange={handleChange} required placeholder="Rua, número, bairro..." />
                  </div>
                  <div className={styles.buttonContainer}>
                    <button type="button" onClick={() => setStep(1)} className={styles.backBtn}>
                      <HiOutlineArrowLeft /> Voltar
                    </button>
                    <button type="submit" className={styles.submitButton} disabled={loading}>
                      {loading ? "Processando..." : "Finalizar Cadastro"}
                    </button>
                  </div>
                </div>
              )}
            </form>

            <div className={styles.loginLink}>
              Já é cadastrado? <Link href="/login">Faça login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}