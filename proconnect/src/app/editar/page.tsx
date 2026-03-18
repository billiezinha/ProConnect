"use client";
import { useState, useEffect } from "react";
import { getCategorias } from "@/service/categoriaService";
import { uploadImagemServico } from "@/service/servicoService"; 
import type { Categoria } from "@/interfaces/CategoriaProps";
import type { Servico, UpdateServicoPayload } from "@/interfaces/ServicoProps";
import styles from "./page.module.css";
import { HiOutlineX } from "react-icons/hi";
import { FaTrash, FaPlus } from "react-icons/fa"; // ✨ Importado o FaPlus e FaTrash
import toast from "react-hot-toast";

// Importações dos novos componentes de Portfólio
import UploadPortfolio from "@/components/UploadPortfolio/UploadPortfolio";
import GaleriaPortfolio from "@/components/GaleriaPortfolio/GaleriaPortfolio";

interface EditServicoModalProps {
  servico: Servico;
  onClose: () => void;
  onSave: (data: UpdateServicoPayload) => void;
}

export default function EditServicoModal({ servico, onClose, onSave }: EditServicoModalProps) {
  const [nomeNegocio, setNomeNegocio] = useState(servico.nomeNegocio);
  const [descricao, setDescricao] = useState(servico.descricao);
  const [categoriaId, setCategoriaId] = useState<number>(servico.categoria?.id || 0);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [valorPreco, setValorPreco] = useState<number>(
    servico.preco && servico.preco.length > 0 ? servico.preco[0].precificacao : 0
  );

  const [novaLogo, setNovaLogo] = useState<File | null>(null);
  const [atualizador, setAtualizador] = useState(0);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await getCategorias();
        setCategorias(data);
      } catch (err) {
        console.error("Erro ao carregar categorias", err);
      }
    };
    fetchCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (novaLogo) {
      try {
        const formData = new FormData();
        formData.append("imagem", novaLogo);
        await uploadImagemServico(servico.id, formData);
        toast.success("Logo do serviço atualizada!");
      } catch (error) {
        toast.error("Erro ao atualizar a Logo.");
      }
    }

    const payload: UpdateServicoPayload = {
      nomeNegocio,
      descricao,
      categoriaId: Number(categoriaId),
      preco: [
        {
          nomeservico: nomeNegocio,
          precificacao: Number(valorPreco)
        }
      ]
    };
    
    onSave(payload);
  };

  const handleUploadSuccess = () => {
    setAtualizador(prev => prev + 1); 
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Editar Serviço</h2>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Fechar">
            <HiOutlineX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          
          {/* ✨ NOVO: CAMPO DE LOGO (Design Circular Exatamente como na Imagem) */}
          <div className={styles.formGroup} style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem', marginBottom: '0.5rem' }}>
            <label className={styles.logoLabelCentered}>Logo / Foto de Capa do Serviço</label>
            
            <div className={styles.logoContainer}>
              <input 
                type="file" 
                accept="image/*" 
                id="upload-logo"
                onChange={(e) => setNovaLogo(e.target.files?.[0] || null)}
                className={styles.fileInputHidden}
              />
              
              <label htmlFor="upload-logo" className={styles.logoPlaceholder}>
                {novaLogo ? (
                  <img src={URL.createObjectURL(novaLogo)} alt="Nova capa" className={styles.logoImage} />
                ) : servico.imagem ? (
                  <img src={servico.imagem} alt="Capa atual" className={styles.logoImage} />
                ) : (
                  <FaPlus className={styles.addIcon} />
                )}
              </label>

              {/* Botão de Remover (Só aparece se houver imagem) */}
              {(novaLogo || servico.imagem) && (
                <button 
                  type="button" 
                  className={styles.removerLogoBtn}
                  onClick={() => setNovaLogo(null)}
                >
                  <FaTrash /> Remover foto
                </button>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nomeNegocio">Nome do Negócio</label>
            <input 
              id="nomeNegocio"
              type="text" 
              value={nomeNegocio} 
              onChange={(e) => setNomeNegocio(e.target.value)} 
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="descricao">Descrição</label>
            <textarea 
              id="descricao"
              value={descricao} 
              onChange={(e) => setDescricao(e.target.value)} 
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="categoria">Categoria</label>
            <select 
              id="categoria"
              value={categoriaId} 
              onChange={(e) => setCategoriaId(Number(e.target.value))} 
              required
            >
              <option value={0} disabled>Selecione uma categoria</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nomeServico}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="preco">Preço Principal (R$)</label>
            <input 
              id="preco"
              type="number" 
              value={valorPreco} 
              onChange={(e) => setValorPreco(Number(e.target.value))} 
              required 
            />
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
            <button type="submit" className={styles.saveBtn}>Salvar Alterações</button>
          </div>
        </form>

        {/* SECÇÃO DO PORTFÓLIO */}
        <div className={styles.portfolioSection} style={{ marginTop: '2.5rem' }}>
          <hr className={styles.divisor} style={{ marginBottom: '1.5rem', borderColor: '#e2e8f0' }} />
          
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1e293b' }}>
              Edição de Galeria de Produtos
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>Adiciona fotos ao teu portfólio de trabalhos.</p>

            <div style={{ marginBottom: '1.5rem' }}>
              <UploadPortfolio servicoId={servico.id} onUploadSuccess={handleUploadSuccess} />
            </div>
            
            <GaleriaPortfolio key={atualizador} servicoId={servico.id} isOwner={true} />
            
          </div>
        </div>

      </div>
    </div>
  );
}