"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createServico } from "@/service/servicoService";
import { getCategorias } from "@/service/categoriaService";
import type { Categoria } from "@/interfaces/CategoriaProps";
import type { PrecoInput } from "@/interfaces/ServicoProps";
import styles from "./Cadproduto.module.css";
import { FaArrowLeft } from "react-icons/fa";

export default function CadastroServicoPage() {
  const router = useRouter();
  const [nomeNegocio, setNomeNegocio] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | "">("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [preco, setPreco] = useState<PrecoInput[]>([
    { nomeservico: "", precificacao: 0 },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await getCategorias();
        setCategorias(data);
      } catch { // 'err' removido daqui
        setError("Não foi possível carregar as categorias.");
      }
    };
    fetchCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!nomeNegocio || !descricao || !categoriaId || preco.length === 0) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    try {
      await createServico({
        nomeNegocio,
        descricao,
        categoriaId: Number(categoriaId),
        preco,
      });
      router.push("/meus-servicos");
    } catch { // 'err' removido daqui
      setError("Ocorreu um erro ao cadastrar o serviço. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.body}>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/perfil" className={styles.backButton}>
            <FaArrowLeft />
          </Link>
          <h1 className={styles.headerTitle}>Cadastro de Serviço</h1>
          <div style={{ width: "30px" }}></div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.container}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.formGroup}>
              <label htmlFor="nomeNegocio" className={styles.label}>
                Nome do Serviço/Negócio
              </label>
              <input
                id="nomeNegocio"
                type="text"
                value={nomeNegocio}
                onChange={(e) => setNomeNegocio(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="descricao" className={styles.label}>
                Descrição
              </label>
              <textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className={styles.textarea}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="categoria" className={styles.label}>
                Categoria
              </label>
              <select
                id="categoria"
                value={categoriaId}
                onChange={(e) => setCategoriaId(Number(e.target.value))}
                className={styles.input}
                required
              >
                <option value="" disabled>
                  Selecione uma categoria
                </option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nomeServico}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="preco" className={styles.label}>
                Preço (R$)
              </label>
              <input
                id="preco"
                type="number"
                value={preco[0].precificacao}
                onChange={(e) =>
                  setPreco([
                    {
                      nomeservico: nomeNegocio || "Preço principal",
                      precificacao: Number(e.target.value),
                    },
                  ])
                }
                className={styles.input}
                required
              />
            </div>

            <div className={styles.actions}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Finalizar Cadastro do Serviço"}
              </button>
              <Link href="/meus-servicos" className={styles.cancelButton}>
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}