"use client";
import { useState, useEffect } from "react";
import { getCategorias } from "@/service/categoriaService";
import type { Categoria } from "@/interfaces/CategoriaProps";
import type { Servico, UpdateServicoPayload } from "@/interfaces/ServicoProps";
import styles from "./page.module.css";
import { HiOutlineX } from "react-icons/hi";

interface EditServicoModalProps {
  servico: Servico;
  onClose: () => void;
  onSave: (data: UpdateServicoPayload) => void;
}

export default function EditServicoModal({ servico, onClose, onSave }: EditServicoModalProps) {
  const [nomeNegocio, setNomeNegocio] = useState(servico.nomeNegocio);
  const [descricao, setDescricao] = useState(servico.descricao);
  
  // SOLUÇÃO DO ERRO: Acessamos apenas 'servico.categoria.id' que é o que existe na interface
  const [categoriaId, setCategoriaId] = useState<number>(
    servico.categoria?.id || 0
  );
  
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  
  const [valorPreco, setValorPreco] = useState<number>(
    servico.preco && servico.preco.length > 0 ? servico.preco[0].precificacao : 0
  );

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveBtn}>
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}