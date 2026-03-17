"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createServico } from "@/service/servicoService";
import { getCategorias } from "@/service/categoriaService";
import type { Categoria } from "@/interfaces/CategoriaProps";
import styles from "./Cadproduto.module.css";
import { FaArrowLeft, FaCamera, FaImages } from "react-icons/fa";

export default function CadastroServicoPage() {
  const router = useRouter();
  
  // Estados do Formulário
  const [nomeNegocio, setNomeNegocio] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | "">("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [preco, setPreco] = useState<number>(0);

  // Estados das Fotos
  const [fotoCapa, setFotoCapa] = useState<File | null>(null);
  const [previewCapa, setPreviewCapa] = useState<string | null>(null);
  const [fotosPortfolio, setFotosPortfolio] = useState<File[]>([]);
  const [previewsPortfolio, setPreviewsPortfolio] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await getCategorias();
        setCategorias(data);
      } catch {
        setError("Não foi possível carregar as categorias.");
      }
    };
    fetchCategorias();
  }, []);

  // Handler para Foto de Capa
  const handleCapaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoCapa(file);
      setPreviewCapa(URL.createObjectURL(file));
    }
  };

  // Handler para Portfólio (Máximo 6)
  const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 6);
      setFotosPortfolio(filesArray);
      const previews = filesArray.map(file => URL.createObjectURL(file));
      setPreviewsPortfolio(previews);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!fotoCapa) {
      setError("A foto de capa é obrigatória.");
      setLoading(false);
      return;
    }

    // Criando o FormData para enviar arquivos
    const formData = new FormData();
    formData.append("NomeNegocio", nomeNegocio);
    formData.append("Descricao", descricao);
    formData.append("CategoriaId", String(categoriaId));
    
    // Formata o preço para o padrão que sua API espera (array de PrecoInput)
    const precoData = [{ nomeservico: nomeNegocio, precificacao: preco }];
    formData.append("PrecoJson", JSON.stringify(precoData));

    // Append dos arquivos
    formData.append("FotoCapa", fotoCapa);
    fotosPortfolio.forEach((foto) => {
      formData.append("FotosPortfolio", foto);
    });

    try {
      await createServico(formData);
      router.push("/meus-servicos");
    } catch (err) {
      setError("Erro ao cadastrar serviço. Verifique os dados e tente novamente.");
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
              <label htmlFor="nomeNegocio" className={styles.label}>Nome do Negócio</label>
              <input id="nomeNegocio" type="text" value={nomeNegocio} onChange={(e) => setNomeNegocio(e.target.value)} className={styles.input} required />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="descricao" className={styles.label}>Descrição</label>
              <textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} className={styles.textarea} required />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="categoria" className={styles.label}>Categoria</label>
              <select id="categoria" value={categoriaId} onChange={(e) => setCategoriaId(Number(e.target.value))} className={styles.input} required>
                <option value="">Selecione...</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nomeServico}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="preco" className={styles.label}>Preço Base (R$)</label>
              <input id="preco" type="number" value={preco} onChange={(e) => setPreco(Number(e.target.value))} className={styles.input} required />
            </div>

            {/* SEÇÃO DE FOTOS */}
            <hr className={styles.divider} />
            
            <div className={styles.formGroup}>
              <label className={styles.label}><FaCamera /> Foto de Capa (Card)</label>
              <input type="file" accept="image/*" onChange={handleCapaChange} className={styles.fileInput} />
              {previewCapa && <img src={previewCapa} alt="Preview Capa" className={styles.previewMain} />}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}><FaImages /> Portfólio (Máx. 6 fotos)</label>
              <input type="file" accept="image/*" multiple onChange={handlePortfolioChange} className={styles.fileInput} />
              <div className={styles.portfolioGrid}>
                {previewsPortfolio.map((url, index) => (
                  <img key={index} src={url} alt="Preview Portfólio" className={styles.previewThumb} />
                ))}
              </div>
            </div>

            <div className={styles.actions}>
              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? "Cadastrando..." : "Finalizar Cadastro"}
              </button>
              <Link href="/meus-servicos" className={styles.cancelButton}>Cancelar</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}