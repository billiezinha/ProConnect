"use client";

import { useState, useEffect } from "react";
import styles from "./Cadproduto.module.css";

export default function Cadproduto() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [nomeCategoria, setNomeCategoria] = useState<string>("");  // Para armazenar o nome da categoria selecionada
  const [nomeMarca, setNomeMarca] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [estado, setEstado] = useState<string>("");
  const [cidade, setCidade] = useState<string>("");
  const [endereco, setEndereco] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [servicos, setServicos] = useState<{ nome: string; preco: string }[]>([]);
  const [erro, setErro] = useState<string>("");
  const [sucesso, setSucesso] = useState<string>("");
  const [categorias, setCategorias] = useState<any[]>([]);  // Lista de categorias

  const categoryId = 6;

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('https://proconnect.koyeb.app/categoria');
        if (!response.ok) {
          throw new Error("Erro ao carregar categorias");
        }
  
        const data = await response.json();
        console.log(data);
  
        setCategorias(data);
        if (data.length > 0) {
          setNomeCategoria(data[0].nome);
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        setErro("Não foi possível carregar as categorias.");
      }
    };
  
    fetchCategorias();
  }, []);
  
  

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddServico = () => {
    setServicos([...servicos, { nome: "", preco: "" }]);
  };

  const handleServicoChange = (index: number, field: "nome" | "preco", value: string) => {
    const updatedServicos = [...servicos];
    updatedServicos[index][field] = value;
    setServicos(updatedServicos);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("nomeMarca", nomeMarca);
    formData.append("categoriaId", categoryId.toString());
    formData.append("telefone", telefone);
    formData.append("estado", estado);
    formData.append("cidade", cidade);
    formData.append("endereco", endereco);
    formData.append("descricao", descricao);

    if (logoPreview) {
      const logoBlob = await fetch(logoPreview).then((res) => res.blob());
      formData.append("logo", logoBlob);
    }

    servicos.forEach((servico, index) => {
      formData.append(`servico[${index}][nome]`, servico.nome);
      formData.append(`servico[${index}][preco]`, servico.preco);
    });

    try {
      const response = await fetch("https://proconnect.koyeb.app/servico", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar produto");
      }

      const data = await response.json();
      setSucesso("Produto cadastrado com sucesso!");
      setErro("");
    } catch (error) {
      setErro("Erro ao cadastrar produto. Tente novamente.");
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <p className={styles.logoText}>Adicione uma foto da logo do seu Negócio</p>
          <div className={styles.logoWrapper}>
            <img
              src={logoPreview || "/Camera.jpg"}
              alt="Logo Preview"
              className={styles.logoPreview}
            />
            <input
              type="file"
              className={styles.inputFile}
              onChange={handleLogoChange}
              aria-label="Upload da logo"
            />
          </div>
        </div>

        <div className={styles.formSection}>
          {erro && <p className={styles.error}>{erro}</p>}
          {sucesso && <p className={styles.success}>{sucesso}</p>}

          <form onSubmit={handleSubmit}>
            <label htmlFor="nome" className={styles.label}>
              Nome do seu negócio
            </label>
            <input
              type="text"
              id="nome"
              className={styles.inputField}
              value={nomeMarca}
              onChange={(e) => setNomeMarca(e.target.value)}
            />

            <label htmlFor="categoria" className={styles.label}>
              Categoria
            </label>
            <select
              id="categoria"
              className={styles.inputField}
              value={nomeCategoria} // A categoria selecionada
              onChange={(e) => setNomeCategoria(e.target.value)} // Atualiza a categoria
            >
              <option value="">Selecione uma categoria</option>
              {categorias.length > 0 ? (
                categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.nome}>
                    {categoria.nome}
                  </option>
                ))
              ) : (
                <option>Carregando categorias...</option>
              )}
            </select>

            <label htmlFor="telefone" className={styles.label}>
              Telefone
            </label>
            <input
              type="tel"
              id="telefone"
              className={styles.inputField}
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />

            <label htmlFor="descricao" className={styles.label}>
              Descrição
            </label>
            <textarea
              id="descricao"
              className={styles.inputField}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />

            {/* Serviços */}
            <label htmlFor="servicos" className={styles.label}>
              Serviços
            </label>
            {servicos.map((servico, index) => (
              <div key={index} className={styles.servicoInput}>
                <input
                  type="text"
                  placeholder="Serviço"
                  value={servico.nome}
                  onChange={(e) => handleServicoChange(index, "nome", e.target.value)}
                  className={styles.inputField}
                />
                <input
                  type="text"
                  placeholder="Preço"
                  value={servico.preco}
                  onChange={(e) => handleServicoChange(index, "preco", e.target.value)}
                  className={styles.inputField}
                />
              </div>
            ))}
            <button
              type="button"
              className={styles.addButton}
              onClick={handleAddServico}
            >
              +
            </button>

            <button type="submit" className={styles.submitButton}>
              Finalizar Cadastro
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
