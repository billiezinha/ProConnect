"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createServico } from "@/service/servicoService";
import { getCategorias } from "@/service/categoriaService";
import type { Categoria } from "@/interfaces/CategoriaProps";
import styles from "./Cadproduto.module.css";
import { FaArrowLeft, FaCamera, FaImages, FaPlus, FaTrash, FaStar } from "react-icons/fa";

export default function CadastroServicoPage() {
  const router = useRouter();
  
  // Estados do Form
  const [nomeNegocio, setNomeNegocio] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | "">("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [precos, setPrecos] = useState([{ nomeservico: "", precificacao: 0 }]);

  // Estados de Fotos
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
      } catch { setError("Erro ao carregar categorias."); }
    };
    fetchCategorias();
  }, []);

  // Handlers
  const handleCapaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoCapa(file);
      setPreviewCapa(URL.createObjectURL(file));
    }
  };

  const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 6);
      setFotosPortfolio(files);
      setPreviewsPortfolio(files.map(f => URL.createObjectURL(f)));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("NomeNegocio", nomeNegocio);
    formData.append("Descricao", descricao);
    formData.append("CategoriaId", String(categoriaId));
    formData.append("Precos", JSON.stringify(precos));
    if (fotoCapa) formData.append("FotoCapa", fotoCapa);
    fotosPortfolio.forEach((f) => formData.append("FotosPortfolio", f));

    try {
      await createServico(formData);
      router.push("/meus-servicos");
    } catch { setError("Erro ao salvar."); } 
    finally { setLoading(false); }
  };

  return (
    <div className={styles.body}>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/perfil" className={styles.backButton}><FaArrowLeft /></Link>
          <h1 className={styles.headerTitle}>Cadastro de Serviço</h1>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.contentLayout}>
          
          {/* LADO ESQUERDO: FORMULÁRIO */}
          <div className={styles.formSection}>
            <form onSubmit={handleSubmit} className={styles.form}>
              {error && <p className={styles.error}>{error}</p>}

              <div className={styles.formGroup}>
                <label className={styles.label}>Nome do Negócio</label>
                <input type="text" value={nomeNegocio} onChange={(e) => setNomeNegocio(e.target.value)} className={styles.input} placeholder="Ex: Barbearia do João" required />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Categoria</label>
                <select value={categoriaId} onChange={(e) => setCategoriaId(Number(e.target.value))} className={styles.input} required>
                  <option value="">Selecione...</option>
                  {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nomeServico}</option>)}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Lista de Preços</label>
                {precos.map((item, index) => (
                  <div key={index} className={styles.priceRow}>
                    <input placeholder="Serviço" value={item.nomeservico} onChange={(e) => {
                      const n = [...precos]; n[index].nomeservico = e.target.value; setPrecos(n);
                    }} className={styles.input} />
                    <input type="number" placeholder="R$" value={item.precificacao} onChange={(e) => {
                      const n = [...precos]; n[index].precificacao = Number(e.target.value); setPrecos(n);
                    }} className={styles.inputSmall} />
                    {precos.length > 1 && <button type="button" onClick={() => setPrecos(precos.filter((_, i) => i !== index))} className={styles.removeBtn}><FaTrash /></button>}
                  </div>
                ))}
                <button type="button" onClick={() => setPrecos([...precos, { nomeservico: "", precificacao: 0 }])} className={styles.addBtn}><FaPlus /> Add Preço</button>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}><FaCamera /> Foto Principal</label>
                <input type="file" accept="image/*" onChange={handleCapaChange} className={styles.input} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}><FaImages /> Portfólio (Máx. 6)</label>
                <input type="file" accept="image/*" multiple onChange={handlePortfolioChange} className={styles.input} />
              </div>

              <button type="submit" className={styles.submitButton} disabled={loading}>{loading ? "Enviando..." : "Cadastrar"}</button>
            </form>
          </div>

          {/* LADO DIREITO: PREVIEW EM TEMPO REAL */}
          <div className={styles.previewSection}>
            <h3 className={styles.previewTitle}>Visualização no App</h3>
            
            {/* CARD SIMULADO */}
            <div className={styles.cardPreview}>
              <div className={styles.cardImageContainer}>
                {previewCapa ? <img src={previewCapa} alt="Capa" /> : <div className={styles.placeholderImg}>Sem imagem</div>}
                <div className={styles.cardBadge}>{categorias.find(c => c.id === categoriaId)?.nomeServico || "Categoria"}</div>
              </div>
              
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h4>{nomeNegocio || "Nome do seu Negócio"}</h4>
                  <span className={styles.rating}><FaStar color="#f1c40f" /> 5.0</span>
                </div>
                
                <p className={styles.cardPreco}>
                  A partir de: <strong>R$ {Math.min(...precos.map(p => p.precificacao)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                </p>

                <div className={styles.portfolioMini}>
                   {previewsPortfolio.map((url, i) => <img key={i} src={url} alt="Portfólio" />)}
                </div>
              </div>
            </div>

            <p className={styles.previewHint}>* Esta é uma prévia de como os clientes verão seu card na busca.</p>
          </div>

        </div>
      </main>
    </div>
  );
}