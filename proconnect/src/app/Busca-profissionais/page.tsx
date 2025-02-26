"use client";

import React, { useState } from "react";
import styles from "./page.module.css";

export default function BuscaServicos() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Encontre o profissional ideal</h1>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="🔍 Busque por um serviço..."
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
          <option value="Picos">Picos</option>
          <option value="Dom Expedito">Dom Expedito</option>
          <option value="Santo Antonio">Santo Antonio</option>
          <option value="Sussuapara">Sussuapara</option>
        </select>
        <button className={styles.searchButton}>Buscar</button>
      </div>

      <div className={styles.cardContainer}>
        {[1, 2].map((item) => (
          <div key={item} className={styles.card}>
            <div className={styles.imagePlaceholder}></div>
            <div className={styles.cardInfo}>
              <h3 className={styles.serviceName}>Nome do serviço</h3>
              <p className={styles.category}>Categoria</p>
              <div className={styles.stars}>⭐ ⭐ ⭐</div>
              <button className={styles.detailsButton}>Detalhes</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
