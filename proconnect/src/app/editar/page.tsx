"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

import { UpdateUserPayload, User } from "@/interfaces/UserProps";
import { getMe, updateUser } from "@/service/userService";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object") {
    const anyErr = err as { message?: string; response?: { data?: { message?: string; error?: string } } };
    return anyErr.response?.data?.message || anyErr.response?.data?.error || anyErr.message || "Erro desconhecido.";
  }
  return "Erro desconhecido.";
}

export default function EditarPage() {
  const router = useRouter();

  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<UpdateUserPayload>({
    nome: "",
    email: "",
    telefone: "",
    estado: "",
    cidade: "",
    endereco: "",
  });

  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    
    (async () => {
      try {
        const user: User = await getMe();
        setUserId(user.id);
        setFormData({
          nome: user.nome ?? "",
          email: user.email ?? "",
          telefone: user.telefone ?? "",
          estado: user.estado ?? "",
          cidade: user.cidade ?? "",
          endereco: user.endereco ?? "",
        });
      } catch {
        setError("Falha ao carregar dados do usuário.");
      } finally {
        setIsFetching(false);
      }
    })();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
        setError("ID do usuário não encontrado. Por favor, faça login novamente.");
        return;
    }

    setError("");
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await updateUser(userId, formData); 
      setSuccess(true);
      setTimeout(() => router.replace("/perfil"), 1200);
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Erro ao atualizar perfil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) {
    return (
      <div className={styles.body}>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className={styles.body}>
       <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/perfil" className={styles.backButton}>
            <FaArrowLeft />
          </Link>
          <h1 className={styles.headerTitle}>Editar Perfil</h1>
          <div style={{ width: "30px" }}></div>
        </div>
      </header>
      <div className={styles.container}>
        <div className={styles.formSection}>
          {success ? (
            <div className={styles.successMessage}>
              <p>Perfil atualizado com sucesso!</p>
              <p>Redirecionando...</p>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} noValidate>
                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.formGroup}>
                  <label htmlFor="nome">Nome Completo</label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    value={formData.nome ?? ""}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email ?? ""}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="telefone">Telefone</label>
                  <input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    value={formData.telefone ?? ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="estado">Estado</label>
                  <input
                    id="estado"
                    name="estado"
                    type="text"
                    value={formData.estado ?? ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="cidade">Cidade</label>
                  <input
                    id="cidade"
                    name="cidade"
                    type="text"
                    value={formData.cidade ?? ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="endereco">Endereço</label>
                  <input
                    id="endereco"
                    name="endereco"
                    type="text"
                    value={formData.endereco ?? ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className={styles.buttonContainer}>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}