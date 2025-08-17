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
  const [servicos, setServicos] = useState<PrecoInput[]>([{ nomeservico: "", precificacao: 0 }]);
  const [loading, setLoading] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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

  function extractErrorMessage(err: unknown): string {
    if (err && typeof err === "object") {
      const maybeAxios = err as { response?: { data?: { message?: string; error?: string } }; message?: string; };
      return maybeAxios.response?.data?.message || maybeAxios.response?.data?.error || maybeAxios.message || "Ocorreu um erro.";
    }
    return "Ocorreu um erro desconhecido.";
  }

  function handleServicoChange<K extends keyof PrecoInput>(index: number, field: K, value: PrecoInput[K]) {
    setServicos((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
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
    if (!nomeMarca.trim() || !descricao.trim() || !categoriaId) return true;
    return !servicos.some(s => s.nomeservico.trim().length > 0 && Number(s.precificacao) > 0);
  }, [nomeMarca, descricao, categoriaId, servicos]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!categoriaId || typeof categoriaId !== "number") {
      setError("Selecione uma categoria válida.");
      setLoading(false);
      return;
    }

    const precoSanitizado = servicos.map(s => ({ ...s, nomeservico: s.nomeservico.trim() })).filter(s => s.nomeservico && Number(s.precificacao) > 0);

    if (precoSanitizado.length === 0) {
      setError("Adicione pelo menos um serviço com preço válido.");
      setLoading(false);
      return;
    }

    const payload: CreateServicoPayload = {
      nomeNegocio: nomeMarca.trim(),
      descricao: descricao.trim(),
      categoriaId,
      preco: precoSanitizado,
    };

    try {
      await createServico(payload);
      setSuccess(true);
      setTimeout(() => router.push("/perfil"), 2000);
    } catch (err) {
      setError(extractErrorMessage(err));
      setLoading(false);
    }
  }

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        {success ? (
          <div className={styles.successMessage}>
            <p>Serviço cadastrado com sucesso!</p>
            <p>Redirecionando para o seu perfil...</p>
          </div>
        ) : (
          <>
            <h1 className={styles.title}>Cadastre seu Serviço</h1>
            <p className={styles.subtitle}>Preencha os campos abaixo para anunciar na ProConnect.</p>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="nomeMarca">Nome da sua marca/negócio</label>
                  <input id="nomeMarca" type="text" value={nomeMarca} onChange={(e) => setNomeMarca(e.target.value)} required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="categoriaId">Categoria</label>
                  {loadingCategorias ? (
                    <div>Carregando...</div>
                  ) : (
                    <select id="categoriaId" value={categoriaId} onChange={(e) => setCategoriaId(Number(e.target.value))} required>
                      <option value="" disabled>Selecione</option>
                      {categorias.map((c) => (<option key={c.id} value={c.id}>{c.nomeServico}</option>))}
                    </select>
                  )}
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="descricao">Descrição dos seus serviços</label>
                <textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={5} required />
              </div>

              <h2 className={styles.sectionTitle}>Tabela de Preços</h2>

              <div className={styles.servicoItemHeader}>
                <label className={styles.servicoNameHeader}>Nome do Serviço</label>
                <label className={styles.servicoPriceHeader}>Preço</label>
              </div>

              {servicos.map((servico, index) => (
                <div key={index} className={styles.servicoItem}>
                  <input type="text" placeholder="Ex: Corte de cabelo masculino" value={servico.nomeservico} onChange={(e) => handleServicoChange(index, "nomeservico", e.target.value)} required />
                  <div className={styles.priceWrapper}>
                    <span className={styles.currencySymbol}>R$</span>
                    <input type="number" placeholder="0,00" value={servico.precificacao === 0 ? "" : servico.precificacao} onChange={(e) => handleServicoChange(index, "precificacao", Number(e.target.value) || 0)} min={0} step="0.01" required />
                  </div>
                  {servicos.length > 1 && (
                    <button type="button" onClick={() => removerServico(index)} className={styles.removeButton} aria-label="Remover serviço">
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              {error && <p className={styles.error}>{error}</p>}
              <div className={styles.actions}>
                <button type="button" onClick={adicionarServico} className={styles.addButton} disabled={loading}>
                  Adicionar outro serviço
                </button>
                <button type="submit" className={styles.submitButton} disabled={loading || formularioInvalido}>
                  {loading ? "Cadastrando..." : "Finalizar Cadastro do Serviço"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}