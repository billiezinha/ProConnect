"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getServicos } from "@/service/servicoService";
import { Servico } from "@/interfaces/ServicoProps";
import styles from "./page.module.css";

export default function BuscaServicos() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getServicos()
      .then((data) => setServicos(data))
      .catch((err) => {
        console.error("Erro ao carregar serviços:", err);
        setError("Não foi possível carregar os serviços.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return servicos.filter((s) => {
      const matchName = s.nomeNegocio
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchLoc = location
        ? s.localizacao?.cidade.toLowerCase() === location.toLowerCase()
        : true;
      return matchName && matchLoc;
    });
  }, [servicos, search, location]);

  if (loading) return <p className={styles.message}>Carregando serviços…</p>;
  if (error) return <p className={styles.messageError}>{error}</p>;

  const cidades = Array.from(
    new Set(
      servicos
        .map((s) => s.localizacao?.cidade)
        .filter((c): c is string => Boolean(c))
    )
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Encontre o profissional ideal</h1>

      <div className={styles.searchContainer}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="🔍 Busque por um serviço..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className={styles.locationSelect}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">Todas as localidades</option>
          {cidades.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className={styles.message}>Nenhum serviço encontrado.</p>
      ) : (
        <div className={styles.cardContainer}>
          {filtered.map((s) => (
            <div key={s.id} className={styles.card}>
              <div className={styles.imagePlaceholder}>
              </div>
              <div className={styles.cardInfo}>
                <h3 className={styles.serviceName}>{s.nomeNegocio}</h3>
                <p className={styles.category}>
                  {s.categoria.nomeServico}
                </p>
                <div className={styles.stars}>
                  ⭐⭐⭐
                </div>
                <button
                  className={styles.detailsButton}
                >
                  Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
