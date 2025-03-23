"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function BuscaServicos() {
  const [search, setSearch] = useState(""); // Busca por categoria
  const [location, setLocation] = useState(""); // Busca por bairro/cidade
  const [servicos, setServicos] = useState([]); // Todos os serviços
  const [filteredServices, setFilteredServices] = useState([]); // Serviços filtrados
  const [localizacoes, setLocalizacoes] = useState([]); // Localizações

  // Carrega serviços e localizações ao montar o componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesResponse, locationsResponse] = await Promise.all([
          fetch("http://localhost:3333/servico"),
          fetch("http://localhost:3333/localizacao"),
        ]);

        if (!servicesResponse.ok) throw new Error("Erro ao carregar os serviços");
        if (!locationsResponse.ok) throw new Error("Erro ao carregar as localizações");

        const servicesData = await servicesResponse.json();
        const locationsData = await locationsResponse.json();

        setServicos(servicesData);
        setLocalizacoes(locationsData);
        setFilteredServices(servicesData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchData();
  }, []);

  // Filtro por categoria e localização
  useEffect(() => {
    const filtered = servicos.filter((servico) => {
      const categoriaMatch = servico.categoria?.nome?.toLowerCase().includes(search.toLowerCase());
      const localizacaoMatch = location
        ? servico.localizacao?.bairro?.toLowerCase().includes(location.toLowerCase()) ||
          servico.localizacao?.cidade?.toLowerCase().includes(location.toLowerCase())
        : true;

      return categoriaMatch && localizacaoMatch;
    });

    setFilteredServices(filtered);
  }, [search, location, servicos]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Encontre o profissional ideal</h1>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="🔍 Busque por categoria..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />

        <select
          className={styles.locationSelect}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">Localização</option>
          {localizacoes.map((localizacao) => (
            <option key={localizacao.id} value={localizacao.bairro}>
              {localizacao.bairro} - {localizacao.cidade}
            </option>
          ))}
        </select>

        <button className={styles.searchButton}>Buscar</button>
      </div>

      <div className={styles.cardContainer}>
        {filteredServices.length > 0 ? (
          filteredServices.map((servico) => (
            <div key={servico.id} className={styles.card}>
              <div className={styles.imagePlaceholder}></div>
              <div className={styles.cardInfo}>
                <h3 className={styles.serviceName}>{servico.nomeNegocio}</h3>
                <p className={styles.category}>
                  {servico.categoria?.nome || "Sem categoria"}
                </p>
                <p className={styles.category}>
                  {servico.localizacao?.bairro}, {servico.localizacao?.cidade}
                </p>
                <div className={styles.stars}>⭐ ⭐ ⭐</div>
                <button className={styles.detailsButton}>Detalhes</button>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhum serviço encontrado</p>
        )}
      </div>
    </div>
  );
}
