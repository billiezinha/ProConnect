"use client";
import { useEffect, useState } from "react";
import { buscarMeusPedidosWhatsapp, ContatoWhatsappProps } from "@/service/contatoWhatsappService";
import { useRouter } from "next/navigation";
import styles from "./page.module.css"; 

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState<ContatoWhatsappProps[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function carregarPedidos() {
      try {
        const dados = await buscarMeusPedidosWhatsapp();
        setPedidos(dados);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarPedidos();
  }, []);

  if (loading) return <div className={styles.loading}>Carregando seus pedidos...</div>;

  return (
    <div className={styles.container}>
      <h2>Meus Pedidos de Contacto</h2>
      <p>Acompanhe os serviços para os quais solicitou contacto via WhatsApp.</p>

      {pedidos.length === 0 ? (
        <div className={styles.empty}>
          <p>Ainda não entrou em contacto com nenhum profissional.</p>
          <button onClick={() => router.push("/")}>Procurar Serviços</button>
        </div>
      ) : (
        <div className={styles.grid}>
          {pedidos.map((pedido) => (
            <div key={pedido.id} className={styles.card}>
              {/* Ajusta a exibição consoante o que o teu back-end envia de volta */}
              <h3>Serviço ID: {pedido.servicoId}</h3> 
              <p>Status: <strong>{pedido.status}</strong></p>
              <p>Data: {new Date(pedido.criadoEm).toLocaleDateString("pt-BR")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}