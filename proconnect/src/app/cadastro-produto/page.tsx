"use client";

import { useState } from "react";
import styles from "./cadastro-servico.module.css";
import { FaUpload, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { CreateServicoPayload, PrecoInput } from "@/interfaces/ServicoProps";
import { createServico } from "@/service/servicoService";
import { jwtDecode } from "jwt-decode"; // Para obter o ID do utilizador

interface DecodedToken {
  sub: string;
}

export default function CadastroServicoPage() {
  const router = useRouter();
  const [nomeMarca, setNomeMarca] = useState("");
  const [nomeCategoria, setNomeCategoria] = useState(1);
  const [descricao, setDescricao] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  // CORRIGIDO: O estado agora usa a estrutura correta da interface PrecoInput
  const [servicos, setServicos] = useState<PrecoInput[]>([{ nomeservico: "", precificacao: 0 }]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // CORRIGIDO: A função agora atualiza os campos 'nomeservico' e 'precificacao'
  const handleServicoChange = (index: number, field: keyof PrecoInput, value: string | number) => {
    const novosServicos = [...servicos];
    novosServicos[index] = { ...novosServicos[index], [field]: value };
    setServicos(novosServicos);
  };

  // CORRIGIDO: Adiciona um novo serviço com a estrutura correta
  const adicionarServico = () => {
    setServicos([...servicos, { nomeservico: "", precificacao: 0 }]);
  };

  const removerServico = (index: number) => {
    const novosServicos = servicos.filter((_, i) => i !== index);
    setServicos(novosServicos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Sessão expirada. Por favor, faça login novamente.");
      setLoading(false);
      router.push("/login");
      return;
    }

    const decodedToken: DecodedToken = jwtDecode(token);
    const userId = Number(decodedToken.sub);

    const payload: CreateServicoPayload = {
      nomeNegocio: nomeMarca,
      descricao,
      // CORRIGIDO: O 'map' agora usa os nomes corretos e garante que o valor é um número
      preco: servicos.map(s => ({
        nomeservico: s.nomeservico,
        precificacao: Number(s.precificacao) || 0
      })),
      categoriaId: Number(nomeCategoria),
      usuarioId: userId,
      imagem: logoPreview,
    };

    try {
      await createServico(payload);
      alert("Serviço cadastrado com sucesso!");
      router.push("/perfil");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro ao cadastrar o serviço.";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <h1 className={styles.title}>Cadastre seu Serviço</h1>
        <p className={styles.subtitle}>Preencha os campos abaixo para anunciar na ProConnect.</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.logoUploader}>
            <label htmlFor="logo-upload" className={styles.uploadArea}>
              {logoPreview ? (
                <img src={logoPreview} alt="Prévia da logo" className={styles.logoPreview} />
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <FaUpload />
                  <span>Clique para enviar sua logo</span>
                </div>
              )}
            </label>
            <input id="logo-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="nomeMarca">Nome da sua marca/negócio</label>
              <input id="nomeMarca" type="text" value={nomeMarca} onChange={(e) => setNomeMarca(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="nomeCategoria">Categoria</label>
              <select id="nomeCategoria" value={nomeCategoria} onChange={(e) => setNomeCategoria(Number(e.target.value))} required>
                <option value={1}>Desenvolvimento</option>
                <option value={2}>Design</option>
                <option value={3}>Marketing</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="descricao">Descrição dos seus serviços</label>
            <textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={5} required />
          </div>

          <h2 className={styles.sectionTitle}>Tabela de Preços</h2>
          {servicos.map((servico, index) => (
            <div key={index} className={styles.servicoItem}>
              {/* CORRIGIDO: Os inputs agora usam 'nomeservico' e 'precificacao' */}
              <input type="text" placeholder="Nome do serviço" value={servico.nomeservico} onChange={(e) => handleServicoChange(index, 'nomeservico', e.target.value)} required />
              <input type="number" placeholder="Preço (R$)" value={servico.precificacao} onChange={(e) => handleServicoChange(index, 'precificacao', parseFloat(e.target.value))} required />
              {servicos.length > 1 && (
                <button type="button" onClick={() => removerServico(index)} className={styles.removeButton}><FaTrash /></button>
              )}
            </div>
          ))}
          <button type="button" onClick={adicionarServico} className={styles.addButton}>Adicionar outro serviço</button>

          {error && <p className={styles.error}>{error}</p>}
          
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "A cadastrar..." : "Finalizar Cadastro do Serviço"}
          </button>
        </form>
      </div>
    </div>
  );
}