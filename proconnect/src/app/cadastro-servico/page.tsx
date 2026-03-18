"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createServico, uploadImagemServico, uploadPortfolioServico } from "@/service/servicoService";
import { getCategorias } from "@/service/categoriaService";
import type { Categoria } from "@/interfaces/CategoriaProps";
import styles from "./Cadproduto.module.css";
import { FaArrowLeft, FaCamera, FaImages, FaPlus, FaTrash, FaStar, FaInfoCircle, FaListUl } from "react-icons/fa";
import SelectCategoria from "@/components/ui/SelectCategoria";

export default function CadastroServicoPage() {
  const router = useRouter();
  const [nomeNegocio, setNomeNegocio] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | "">("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [precos, setPrecos] = useState([{ nomeservico: "", precificacao: 0 }]);
  
  const [fotoCapa, setFotoCapa] = useState<File | null>(null);
  const [previewCapa, setPreviewCapa] = useState<string | null>(null);
  const [fotosPortfolio, setFotosPortfolio] = useState<File[]>([]);
  const [previewsPortfolio, setPreviewsPortfolio] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategorias();
        setCategorias(data);
      } catch { setError("Erro ao carregar categorias."); }
    };
    fetchCats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação extra: Garante que uma categoria foi selecionada no novo componente
    if (!categoriaId) {
      setError("Por favor, selecione uma categoria para o seu serviço.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ETAPA 1: Criar o serviço (JSON)
      const novoServico = await createServico({
        nomeNegocio,
        descricao,
        categoriaId: Number(categoriaId),
        preco: precos
      });

      const servicoId = novoServico.id;

      if (!servicoId) throw new Error("ID do serviço não retornado.");

      // ETAPA 2: Upload da foto de capa (Single - chave "imagem")
      if (fotoCapa) {
        const formCapa = new FormData();
        formCapa.append("imagem", fotoCapa);
        await uploadImagemServico(servicoId, formCapa);
      }

      // ETAPA 3: Upload do portfólio (Um por um para evitar MulterError)
      if (fotosPortfolio.length > 0) {
        for (const foto of fotosPortfolio) {
          const formPort = new FormData();
          formPort.append("imagem", foto); 
          try {
            await uploadPortfolioServico(servicoId, formPort);
          } catch (pErr) {
            console.error("Falha ao subir uma imagem do portfólio", pErr);
          }
        }
      }

      router.push("/meus-servicos");
    } catch (err: any) {
      console.error(err);
      setError("Erro ao salvar. Verifique se os campos estão corretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.body}>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/perfil" className={styles.backButton}><FaArrowLeft /></Link>
          <h1 className={styles.headerTitle}>Novo Serviço</h1>
          <div style={{ width: "30px" }}></div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.contentLayout}>
            
            <div className={styles.formSection}>
              <form onSubmit={handleSubmit} className={styles.form}>
                {error && <p className={styles.error}>{error}</p>}
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nome do Negócio</label>
                  <input className={styles.input} value={nomeNegocio} onChange={e => setNomeNegocio(e.target.value)} placeholder="Ex: Studio Beauty" required />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}><FaInfoCircle /> Descrição</label>
                  <textarea className={styles.textarea} value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Conte um pouco sobre seu trabalho..." required />
                </div>

                {/* ✨ CAIXA DE PESQUISA INTELIGENTE DE CATEGORIA */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Categoria</label>
                  <SelectCategoria 
                    categorias={categorias} 
                    value={Number(categoriaId) || 0} 
                    onChange={(novoId) => setCategoriaId(novoId)} 
                  />
                </div>

                <div className={styles.priceContainer}>
                  <label className={styles.label}><FaListUl /> Tabela de Preços</label>
                  <div className={styles.priceHeader}>
                    <span>Serviço</span>
                    <span>Preço (R$)</span>
                  </div>
                  {precos.map((p, i) => (
                    <div key={i} className={styles.priceRow}>
                      <input className={styles.input} placeholder="Ex: Manicure" value={p.nomeservico} onChange={e => {
                        const newP = [...precos]; newP[i].nomeservico = e.target.value; setPrecos(newP);
                      }} required />
                      <input type="number" className={styles.inputSmall} placeholder="0,00" value={p.precificacao} onChange={e => {
                        const newP = [...precos]; newP[i].precificacao = Number(e.target.value); setPrecos(newP);
                      }} required />
                      {precos.length > 1 && (
                        <button type="button" className={styles.removeBtn} onClick={() => setPrecos(precos.filter((_, idx) => idx !== i))}><FaTrash /></button>
                      )}
                    </div>
                  ))}
                  <button type="button" className={styles.addBtn} onClick={() => setPrecos([...precos, {nomeservico: "", precificacao: 0}])}>
                    <FaPlus /> Adicionar outro item
                  </button>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}><FaCamera /> Foto Principal (Card)</label>
                  <input type="file" accept="image/*" onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) { setFotoCapa(file); setPreviewCapa(URL.createObjectURL(file)); }
                  }} />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}><FaImages /> Portfólio (Máx 6 fotos)</label>
                  <input type="file" accept="image/*" multiple onChange={e => {
                    if (e.target.files) {
                      const files = Array.from(e.target.files).slice(0, 6);
                      setFotosPortfolio(files);
                      setPreviewsPortfolio(files.map(f => URL.createObjectURL(f)));
                    }
                  }} />
                </div>

                <button type="submit" className={styles.submitButton} disabled={loading}>
                  {loading ? "Processando Uploads..." : "Publicar Serviço"}
                </button>
              </form>
            </div>

            <div className={styles.previewSection}>
              <h3 className={styles.previewTitle}>Prévia do Card</h3>
              <div className={styles.cardPreview}>
                <div className={styles.cardImageContainer}>
                  {previewCapa ? <img src={previewCapa} alt="Capa" /> : <div className={styles.placeholderImg}>Sua Foto</div>}
                  <div className={styles.cardBadge}>{categorias.find(c => c.id === categoriaId)?.nomeServico || "Categoria"}</div>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <h4>{nomeNegocio || "Nome do Negócio"}</h4>
                    <span className={styles.rating}><FaStar color="#f1c40f" /> 5.0</span>
                  </div>
                  <p className={styles.previewDesc}>
                    {descricao ? (descricao.length > 80 ? descricao.substring(0, 80) + "..." : descricao) : "Sua descrição aparecerá aqui."}
                  </p>
                  <p className={styles.cardPreco}>
                    A partir de: <strong>R$ {precos.length > 0 ? Math.min(...precos.map(p => p.precificacao)).toFixed(2) : "0.00"}</strong>
                  </p>
                  <div className={styles.portfolioMini}>
                    {previewsPortfolio.map((url, i) => <img key={i} src={url} alt="Portfolio" />)}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}