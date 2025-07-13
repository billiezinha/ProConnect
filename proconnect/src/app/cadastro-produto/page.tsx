"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createServico,
  CreateServicoPayload,
  PrecoInput,
} from "@/service/servicoService";
import { getCategorias } from "@/service/categoriaService";
import { Categoria } from "@/interfaces/CategoriaProps";
import styles from "./Cadproduto.module.css";
import Image from "next/image";

export default function Cadproduto() {
  const router = useRouter();

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [nomeCategoria, setNomeCategoria] = useState<number>(1);
  const [nomeMarca, setNomeMarca] = useState("");
  const [telefone] = useState("");
  const [estado] = useState("");
  const [cidade] = useState("");
  const [endereco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [servicos, setServicos] = useState<PrecoInput[]>([]);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    getCategorias()
      .then((data) => {
        setCategorias(data);
        if (data.length) setNomeCategoria(data[0].id);
      })
      .catch(() => {
        setErro("Não foi possível carregar as categorias.");
      });
  }, []);

  useEffect(() => {
    if (sucesso) {
      const timer = setTimeout(() => {
        setSucesso("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [sucesso]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddServico = () => {
    setServicos([...servicos, { nomeservico: "", precificacao: 0 }]);
  };

  const handleServicoChange = (
    idx: number,
    field: keyof PrecoInput,
    value: string
  ) => {
    const updated = [...servicos];
    if (field === "precificacao") {
      updated[idx][field] = Number(value);
    } else {
      updated[idx][field] = value;
    }
    setServicos(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateServicoPayload = {
      nomeNegocio: nomeMarca,
      descricao,
      preco: servicos,
      categoriaId: nomeCategoria,
      usuarioId: Number(localStorage.getItem("userId") || "1"),
      localizacao: {
        numero: endereco,
        bairro: telefone,
        cidade,
        estado,
      },
    };

    try {
      const response = await createServico(payload); // ← precisa retornar o ID
      setErro("");
      setSucesso("Serviço cadastrado com sucesso!");

      setTimeout(() => {
        router.push(`/?detalhar=${response.id}`);
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        setErro("Erro ao cadastrar serviço.");
      }
    }
  };

  return (
    <>
      {sucesso && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#4caf50",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          {sucesso}
        </div>
      )}

      <div className={styles.body}>
        <div className={styles.container}>
          {/* logo */}
          <div className={styles.logoSection}>
            <p className={styles.logoText}>Foto da Logo do Negócio</p>
            <div className={styles.logoWrapper}>
              <Image
                src={logoPreview || "/Camera.jpg"}
                alt="Logo Preview"
                className={styles.logoPreview}
                width={100}
                height={100}
              />
              <input
                type="file"
                className={styles.inputFile}
                onChange={handleLogoChange}
              />
            </div>
          </div>

          <div className={styles.formSection}>
            {erro && <p className={styles.error}>{erro}</p>}

            <form onSubmit={handleSubmit}>
              <label className={styles.label}>Nome do Negócio</label>
              <input
                type="text"
                className={styles.inputField}
                value={nomeMarca}
                onChange={(e) => setNomeMarca(e.target.value)}
                required
              />

              <label className={styles.label}>Categoria</label>
              <select
                className={styles.inputField}
                value={nomeCategoria}
                onChange={(e) => setNomeCategoria(Number(e.target.value))}
              >
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nomeServico}
                  </option>
                ))}
              </select>

              <label className={styles.label}>Descrição</label>
              <textarea
                className={styles.inputField}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />

              <label className={styles.label}>Serviços & Preços</label>
              {servicos.map((s, i) => (
                <div key={i} className={styles.servicoInput}>
                  <input
                    type="text"
                    placeholder="Serviço"
                    className={styles.inputField}
                    value={s.nomeservico}
                    onChange={(e) =>
                      handleServicoChange(i, "nomeservico", e.target.value)
                    }
                    required
                  />
                  <input
                    type="number"
                    placeholder="Preço"
                    className={styles.inputField}
                    value={s.precificacao}
                    onChange={(e) =>
                      handleServicoChange(i, "precificacao", e.target.value)
                    }
                    required
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
    </>
  );
}
