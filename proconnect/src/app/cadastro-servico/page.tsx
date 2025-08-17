"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import styles from "./Cadproduto.module.css";

import { createServico } from "@/service/servicoService";
import { getCategorias } from "@/service/categoriaService";
import { CreateServicoPayload, PrecoInput } from "@/interfaces/ServicoProps";
import { Categoria } from "@/interfaces/CategoriaProps";

export default function CadastroServicoPage() {
  const router = useRouter();

  const [nomeMarca, setNomeMarca] = useState("");
  const [descricao, setDescricao] = useState("");

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaId, setCategoriaId] = useState<number | "">("");

  const [servicos, setServicos] = useState<PrecoInput[]>([
    { nomeservico: "", precificacao: 0 },
  ]);

  const [loading, setLoading] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [error, setError] = useState("");

  // Carrega categorias reais do backend
  useEffect(() => {
    (async () => {
      try {
        const lista = await getCategorias();
        setCategorias(lista);
        if (lista.length > 0) setCategoriaId(lista[0].id);
      } catch (err) {
        console.error("Falha ao carregar categorias:", err);
        setError("Não foi possível carregar as categorias. Tente novamente.");
      } finally {
        setLoadingCategorias(false);
      }
    })();
  }, []);

  function handleServicoChange(
    index: number,
    field: keyof PrecoInput,
    value: string | number
  ) {
    setServicos((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value as never };
      return copy;
    });
  }

  function adicionarServico() {
    setServicos((prev) => [...prev, { nomeservico: "", precificacao: 0 }]);
  }

  function removerServico(index: number) {
    setServicos((prev) => prev.filter((_, i) => i !== index));
  }

  const formularioInvalido = useMemo(() => {
    if (!nomeMarca.trim()) return true;
    if (!descricao.trim()) return true;
    if (!categoriaId || typeof categoriaId !== "number") return true;

    // pelo menos um serviço válido
    const temUmValido = servicos.some(
      (s) => s.nomeservico.trim().length > 0 && Number(s.precificacao) >= 0
    );
    if (!temUmValido) return true;

    return false;
  }, [nomeMarca, descricao, categoriaId, servicos]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Garante que o token existe (rota /servico é autenticada)
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Sessão expirada. Faça login novamente.");
      setLoading(false);
      return;
    }

    if (!categoriaId || typeof categoriaId !== "number") {
      setError("Selecione uma categoria válida.");
      setLoading(false);
      return;
    }

    // Sanitiza a tabela de preços: remove linhas totalmente vazias
    const precoSanitizado = servicos
      .map((s) => ({
        nomeservico: s.nomeservico.trim(),
        precificacao: Number(s.precificacao) || 0,
      }))
      .filter((s) => s.nomeservico.length > 0);

    if (precoSanitizado.length === 0) {
      setError("Adicione pelo menos um item na tabela de preços.");
      setLoading(false);
      return;
    }

    const payload: CreateServicoPayload = {
      nomeNegocio: nomeMarca.trim(),
      descricao: descricao.trim(),
      categoriaId: Number(categoriaId),
      preco: precoSanitizado,
    };

    try {
      await createServico(payload);
      alert("Serviço cadastrado com sucesso!");
      router.push("/perfil");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Ocorreu um erro ao cadastrar o serviço.";
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <h1 className={styles.title}>Cadastre seu Serviço</h1>
        <p className={styles.subtitle}>
          Preencha os campos abaixo para anunciar na ProConnect.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="nomeMarca">Nome da sua marca/negócio</label>
              <input
                id="nomeMarca"
                type="text"
                value={nomeMarca}
                onChange={(e) => setNomeMarca(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="categoriaId">Categoria</label>

              {loadingCategorias ? (
                <div className={styles.hint}>Carregando categorias…</div>
              ) : categorias.length === 0 ? (
                <div className={styles.error}>
                  Nenhuma categoria encontrada. Contate o administrador.
                </div>
              ) : (
                <select
                  id="categoriaId"
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(Number(e.target.value))}
                  required
                >
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nomeServico}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="descricao">Descrição dos seus serviços</label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={5}
              required
            />
          </div>

          <h2 className={styles.sectionTitle}>Tabela de Preços</h2>
          {servicos.map((servico, index) => (
            <div key={index} className={styles.servicoItem}>
              <input
                type="text"
                placeholder="Nome do serviço"
                value={servico.nomeservico}
                onChange={(e) =>
                  handleServicoChange(index, "nomeservico", e.target.value)
                }
                required
              />
              <input
                type="number"
                placeholder="Preço (R$)"
                value={servico.precificacao}
                onChange={(e) =>
                  handleServicoChange(
                    index,
                    "precificacao",
                    Number(e.target.value) || 0
                  )
                }
                min={0}
                step="0.01"
                required
              />
              {servicos.length > 1 && (
                <button
                  type="button"
                  onClick={() => removerServico(index)}
                  className={styles.removeButton}
                  aria-label={`Remover serviço ${index + 1}`}
                  title="Remover serviço"
                >
                  <FaTrash aria-hidden />
                </button>
              )}
            </div>
          ))}

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={adicionarServico}
              className={styles.addButton}
              disabled={loading || loadingCategorias || categorias.length === 0}
            >
              Adicionar outro serviço
            </button>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={
                loading ||
                loadingCategorias ||
                categorias.length === 0 ||
                formularioInvalido
              }
            >
              {loading ? "A cadastrar..." : "Finalizar Cadastro do Serviço"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
