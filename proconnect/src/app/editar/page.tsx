"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

import { UpdateUserPayload, User } from "@/interfaces/UserProps";
import { getUserById, updateUser } from "@/service/userService";

export default function EditarPage() {
  const router = useRouter();

  // estados separados para carregar e salvar (evita confusão visual)
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

  // --- Utils: decodifica JWT sem dependência externa ---
  type JwtPayload = { userId?: number | string; sub?: number | string; [k: string]: unknown };

  function decodeJwt<T = JwtPayload>(token: string): T | null {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    try {
      let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      // padding
      while (base64.length % 4 !== 0) base64 += "=";

      const json = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(json) as T;
    } catch {
      return null;
    }
  }

  function extractUserIdFromToken(token: string): number | null {
    const payload = decodeJwt<JwtPayload>(token);
    if (!payload) return null;
    const raw = payload.userId ?? payload.sub;
    if (raw === undefined || raw === null) return null;
    const num = Number(raw);
    return Number.isNaN(num) ? null : num;
  }
  // -----------------------------------------------------

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const uid = extractUserIdFromToken(token);
    if (!uid) {
      localStorage.removeItem("token");
      router.replace("/login");
      return;
    }

    setUserId(uid);

    (async () => {
      try {
        const user: User = await getUserById(uid);
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
    if (!userId) return;

    setError("");
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await updateUser(userId, formData);
      setSuccess(true);
      setTimeout(() => router.replace("/perfil"), 1200);
    } catch (err: any) {
      setError(err?.message || "Erro ao atualizar perfil.");
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
      <div className={styles.container}>
        <div className={styles.formSection}>
          {success ? (
            <div className={styles.successMessage}>
              <p>Perfil atualizado com sucesso!</p>
              <p>Redirecionando...</p>
            </div>
          ) : (
            <>
              <h1 className={styles.title}>Editar Perfil</h1>

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
                    type="button"
                    onClick={() => router.push("/perfil")}
                    className={`${styles.submitButton} ${styles.secondaryButton}`}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>

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
