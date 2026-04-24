"use client";
import { useState, useEffect } from "react";
import { getCategorias } from "@/service/categoriaService";
import { uploadImagemServico, removerImagemServico } from "@/service/servicoService";
import type { Categoria } from "@/interfaces/CategoriaProps";
import type { Servico, UpdateServicoPayload } from "@/interfaces/ServicoProps";
import styles from "./page.module.css";
import { HiOutlineX } from "react-icons/hi";
import { FaTrash, FaPlus } from "react-icons/fa";
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
  
  // ✨ NOVO ESTADO: Controla se a imagem que vem do banco de dados deve ser escondida/removida
  const [logoRemovida, setLogoRemovida] = useState(false);
  
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
    
    // ✨ LÓGICA 1: Apaga a imagem fisicamente do Supabase se o utilizador removeu
    if (logoRemovida && !novaLogo) {
      try {
        await removerImagemServico(servico.id);
        toast.success("Logo antiga removida com sucesso!");
      } catch (error) {
        console.error("Erro ao remover logo", error);
      }
    }

    // ✨ LÓGICA 2: Faz o upload se o utilizador escolheu uma foto nova
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

    // ✨ LÓGICA 3: O payload com a estrutura EXATA para não dar Erro 500 no Prisma!
    const payload: any = {
      nomeNegocio,
      descricao,
      categoriaId: Number(categoriaId),
      // O Prisma precisa deste formato (deleteMany + create) para conseguir atualizar o preço!
      preco: {
        deleteMany: {}, 
        create: [
          {
            nomeservico: nomeNegocio,
            precificacao: Number(valorPreco)
          }
        ]
      }
    };
    
    onSave(payload as UpdateServicoPayload);
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
          
          {/* CAMPO DE LOGO */}
          <div className={styles.formGroup} style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem', marginBottom: '0.5rem' }}>
            <label className={styles.logoLabelCentered}>Logo / Foto de Capa do Serviço</label>
            
            <div className={styles.logoContainer}>
              <input 
                type="file" 
                accept="image/*" 
                id="upload-logo"
                onChange={(e) => {
                  setNovaLogo(e.target.files?.[0] || null);
                  setLogoRemovida(false); // Se escolher uma nova, já não está "removida"
                }}
                className={styles.fileInputHidden}
              />
              
              <label htmlFor="upload-logo" className={styles.logoPlaceholder}>
                {novaLogo ? (
                  <img src={URL.createObjectURL(novaLogo)} alt="Nova capa" className={styles.logoImage} />
                ) : (servico.imagem && !logoRemovida) ? ( // ✨ Agora verifica se NÃO foi removida
                  <img src={servico.imagem} alt="Capa atual" className={styles.logoImage} />
                ) : (
                  <FaPlus className={styles.addIcon} />
                )}
              </label>

              {/* Botão de Remover */}
              {(novaLogo || (servico.imagem && !logoRemovida)) && (
                <button 
                  type="button" 
                  className={styles.removerLogoBtn}
                  onClick={() => {
                    setNovaLogo(null); // Limpa o ficheiro que acabou de ser escolhido (se houver)
                    setLogoRemovida(true); // Esconde a imagem antiga que vem do banco
                  }}
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
              <UploadPortfolio 
                servicoId={servico.id} 
                onUploadSuccess={handleUploadSuccess} 
                isPremium={servico.usuario?.plano === "premium"} 
              />
            </div>
            
            <GaleriaPortfolio key={atualizador} servicoId={servico.id} isOwner={true} />
            
          </div>
        </div>

      </div>
    </div>
  );
}