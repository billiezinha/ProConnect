"use client";
import { useState, useEffect } from "react";
import { listarFavoritos, adicionarFavorito, removerFavorito } from "../service/favoritoService";

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<number[]>([]);

  useEffect(() => {
    const carregarFavoritos = async () => {
      const token = localStorage.getItem("token");
      
      if (token) {
        try {
          // O TypeScript agora sabe que dadosDoBanco é FavoritoProps[]
          const dadosDoBanco = await listarFavoritos();
          
          const ids = dadosDoBanco.map((fav) => fav.servicoId);
          setFavoritos(ids);
          localStorage.setItem("@ProConnect:favoritos", JSON.stringify(ids));
        } catch (error) {
          console.error("Erro ao carregar favoritos da API", error);
        }
      } else {
        const salvos = localStorage.getItem("@ProConnect:favoritos");
        if (salvos) setFavoritos(JSON.parse(salvos));
      }
    };

    carregarFavoritos();
  }, []);

  const toggleFavorito = async (id: number) => {
    const isFav = favoritos.includes(id);
    const token = localStorage.getItem("token");

    const novaLista = isFav 
      ? favoritos.filter((favId) => favId !== id) 
      : [...favoritos, id];
      
    setFavoritos(novaLista);
    localStorage.setItem("@ProConnect:favoritos", JSON.stringify(novaLista));

    if (token) {
      try {
        if (isFav) {
          await removerFavorito(id);
        } else {
          await adicionarFavorito(id);
        }
      } catch (error) {
        console.error("Erro ao sincronizar favorito com o servidor:", error);
      }
    }
  };

  const isFavorito = (id: number) => favoritos.includes(id);

  return { favoritos, toggleFavorito, isFavorito };
}