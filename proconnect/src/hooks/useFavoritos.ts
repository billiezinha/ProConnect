"use client";
import { useState, useEffect } from "react";

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<number[]>([]);

  // Carrega do localStorage assim que a página abre
  useEffect(() => {
    const salvos = localStorage.getItem("@ProConnect:favoritos");
    if (salvos) setFavoritos(JSON.parse(salvos));
  }, []);

  const toggleFavorito = (id: number) => {
    let novaLista;
    if (favoritos.includes(id)) {
      novaLista = favoritos.filter((favId) => favId !== id);
    } else {
      novaLista = [...favoritos, id];
    }
    
    setFavoritos(novaLista);
    localStorage.setItem("@ProConnect:favoritos", JSON.stringify(novaLista));
  };

  const isFavorito = (id: number) => favoritos.includes(id);

  return { favoritos, toggleFavorito, isFavorito };
}