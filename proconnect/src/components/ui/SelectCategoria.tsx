"use client";
import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaSearch } from "react-icons/fa";

interface Categoria {
  id: number;
  nomeServico: string;
}

interface SelectCategoriaProps {
  categorias: Categoria[];
  value: number; // ID da categoria selecionada
  onChange: (id: number) => void;
}

export default function SelectCategoria({ categorias, value, onChange }: SelectCategoriaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Encontra o nome da categoria selecionada para mostrar no botão
  const selectedCat = categorias.find((c) => c.id === value);

  // Filtra as categorias com base no que o utilizador está a digitar (ignorando acentos e maiúsculas)
  const filtradas = categorias.filter((c) => {
    const nomeLimpo = c.nomeServico.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const buscaLimpa = search.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return nomeLimpo.includes(buscaLimpa);
  });

  // Fecha a lista se o utilizador clicar fora dela
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
      {/* BOTÃO PRINCIPAL */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "14px 16px",
          border: "2px solid var(--cor-borda, #e2e8f0)",
          borderRadius: "12px",
          background: "var(--cor-fundo-input, #fff)",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: selectedCat ? "var(--cor-texto, #1e293b)" : "#94a3b8",
          fontWeight: selectedCat ? "600" : "normal"
        }}
      >
        <span>{selectedCat ? selectedCat.nomeServico : "Digite ou procure a sua profissão..."}</span>
        <FaChevronDown style={{ color: "#94a3b8", transform: isOpen ? "rotate(180deg)" : "none", transition: "0.2s" }} />
      </div>

      {/* CAIXA SUSPENSA COM PESQUISA */}
      {isOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "var(--cor-fundo-card, #fff)",
          border: "1px solid var(--cor-borda, #e2e8f0)",
          borderRadius: "12px",
          marginTop: "8px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          zIndex: 100,
          maxHeight: "300px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
          {/* BARRA DE PESQUISA INTERNA */}
          <div style={{ padding: "10px", borderBottom: "1px solid var(--cor-borda, #e2e8f0)", display: "flex", alignItems: "center", gap: "10px" }}>
            <FaSearch style={{ color: "#94a3b8" }} />
            <input 
              type="text" 
              autoFocus
              placeholder="Pesquisar categoria..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: "none",
                width: "100%",
                outline: "none",
                background: "transparent",
                color: "var(--cor-texto, #1e293b)",
                fontSize: "1rem"
              }}
            />
          </div>

          {/* LISTA DE RESULTADOS */}
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filtradas.length > 0 ? filtradas.map(cat => (
              <div 
                key={cat.id}
                onClick={() => {
                  onChange(cat.id);
                  setIsOpen(false);
                  setSearch("");
                }}
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  borderBottom: "1px solid var(--cor-fundo-site, #f8fafc)",
                  background: value === cat.id ? "rgba(139, 44, 245, 0.1)" : "transparent",
                  color: value === cat.id ? "var(--cor-primaria, #8b2cf5)" : "var(--cor-texto, #1e293b)",
                  fontWeight: value === cat.id ? "bold" : "normal",
                }}
              >
                {cat.nomeServico}
              </div>
            )) : (
              <div style={{ padding: "15px", textAlign: "center", color: "#94a3b8", fontSize: "0.9rem" }}>
                Nenhuma profissão encontrada para "{search}".
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}