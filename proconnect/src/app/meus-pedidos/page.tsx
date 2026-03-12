"use client";
import { useEffect, useState } from "react";
import api from "@/service/api";
import styles from "./page.module.css";
import toast from "react-hot-toast";

export default function MeusPedidosPage() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    async function loadPedidos() {
      const { data } = await api.get("/usuario/meus-pedidos");
      setPedidos(data);
    }
    loadPedidos();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Meus Contatos e Pedidos</h1>
      <div className={styles.list}>
        {pedidos.map((pedido: any) => (
          <div key={pedido.id} className={styles.card}>
            <div>
              <h3>{pedido.servico.nomeNegocio}</h3>
              <p>Contatado em: {new Date(pedido.criadoEm).toLocaleDateString()}</p>
            </div>
            
            {/* O BOTÃO SÓ APARECE SE ELE NÃO AVALIOU AINDA */}
            {!pedido.avaliado ? (
              <button 
                onClick={() => handleAbrirAvaliacao(pedido)}
                className={styles.btnAvaliar}
              >
                Avaliar Serviço
              </button>
            ) : (
              <span className={styles.badgeConcluido}>Avaliado ✅</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}