"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './Chat.module.css';
import { io, Socket } from 'socket.io-client';
import api from '@/service/api';
import Navbar from '@/components/navbar/Navbar';
import { Send, User, MessageSquare } from 'lucide-react';

export default function ChatPage() {
  const [usuarioAtual, setUsuarioAtual] = useState<any>(null);
  const [conversas, setConversas] = useState<any[]>([]);
  const [conversaAtiva, setConversaAtiva] = useState<any>(null);
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [texto, setTexto] = useState('');
  
  const socketRef = useRef<Socket | null>(null);
  const mensagensFimRef = useRef<HTMLDivElement>(null);

  // 1. Carrega o Utilizador e inicializa o Socket
  useEffect(() => {
    // Tenta pegar o user do localStorage
    const userStr = localStorage.getItem('user'); 
    
    if (userStr) {
      const user = JSON.parse(userStr);
      setUsuarioAtual(user);
      carregarConversas(user.id);

      // Liga-se ao servidor WebSocket
      // ⚠️ Mude para http://localhost:3333 se estiver a testar localmente
      socketRef.current = io("https://proconnectapi-2.onrender.com");

      // Limpa a conexão quando sai da página
      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, []);

  // 2. Escuta novas mensagens em tempo real
  useEffect(() => {
    if (!socketRef.current) return;

    const lidarComNovaMensagem = (novaMensagem: any) => {
      // Só adiciona ao ecrã se a mensagem pertencer à conversa que está aberta
      if (conversaAtiva && novaMensagem.conversaId === conversaAtiva.id) {
        setMensagens((prev) => [...prev, novaMensagem]);
      }
    };

    socketRef.current.on("nova_mensagem", lidarComNovaMensagem);

    return () => {
      socketRef.current?.off("nova_mensagem", lidarComNovaMensagem);
    };
  }, [conversaAtiva]);

  // Rola para o fundo sempre que há novas mensagens
  useEffect(() => {
    mensagensFimRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const carregarConversas = async (userId: number) => {
    try {
      const res = await api.get(`/chat/usuario/${userId}`);
      // CORREÇÃO: Avisamos o TypeScript que a resposta é um Array
      setConversas(res.data as any[]); 
    } catch (error) {
      console.error("Erro ao carregar conversas", error);
    }
  };

  const abrirConversa = async (conversa: any) => {
    setConversaAtiva(conversa);
    // Avisa o servidor que entramos nesta sala
    socketRef.current?.emit("entrar_conversa", conversa.id);

    try {
      // Busca o histórico de mensagens desta conversa na Base de Dados
      const res = await api.get(`/chat/${conversa.id}/mensagens`);
      // CORREÇÃO: Avisamos o TypeScript que a resposta é um Array
      setMensagens(res.data as any[]); 
    } catch (error) {
      console.error("Erro ao carregar histórico", error);
    }
  };

  const enviarMensagem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim() || !conversaAtiva || !usuarioAtual) return;

    const dadosMensagem = {
      conversaId: conversaAtiva.id,
      remetenteId: usuarioAtual.id,
      texto: texto
    };

    // Envia a mensagem pelo WebSocket
    socketRef.current?.emit("enviar_mensagem", dadosMensagem);
    setTexto(''); // Limpa o input
  };

  // Função auxiliar para saber o nome da outra pessoa
  const obterNomeOutroUsuario = (conversa: any) => {
    if (!usuarioAtual) return "";
    return conversa.clienteId === usuarioAtual.id 
      ? conversa.profissional.nome 
      : conversa.cliente.nome;
  };

  return (
    <>
      <Navbar />
      <div className={styles.chatContainer}>
        
        {/* BARRA LATERAL - LISTA DE CONVERSAS */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>As Minhas Mensagens</h2>
          </div>
          
          <div className={styles.conversasList}>
            {conversas.length === 0 ? (
              <p style={{textAlign: 'center', padding: '20px', color: '#94a3b8'}}>Nenhuma conversa ainda.</p>
            ) : (
              conversas.map((conv) => (
                <div 
                  key={conv.id} 
                  className={`${styles.conversaItem} ${conversaAtiva?.id === conv.id ? styles.conversaAtiva : ''}`}
                  onClick={() => abrirConversa(conv)}
                >
                  <div className={styles.avatarPlaceholder}>
                    <User size={24} />
                  </div>
                  <div className={styles.conversaInfo}>
                    <div className={styles.conversaNome}>
                      {obterNomeOutroUsuario(conv)}
                    </div>
                    <div className={styles.ultimaMensagem}>
                      {/* Mostra o último texto se existir */}
                      {conv.mensagens && conv.mensagens.length > 0 
                        ? conv.mensagens[0].texto 
                        : "Nova conversa"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ÁREA PRINCIPAL DO CHAT */}
        <div className={styles.chatArea}>
          {!conversaAtiva ? (
            <div className={styles.emptyState}>
              <MessageSquare size={64} style={{ marginBottom: '20px', opacity: 0.2 }} />
              <h2>Selecione uma conversa para começar</h2>
            </div>
          ) : (
            <>
              {/* Cabeçalho da Conversa */}
              <div className={styles.chatHeader}>
                <div className={styles.avatarPlaceholder}>
                  <User size={24} />
                </div>
                <div>
                  <h3 className={styles.conversaNome}>{obterNomeOutroUsuario(conversaAtiva)}</h3>
                </div>
              </div>

              {/* Lista de Mensagens */}
              <div className={styles.mensagensList}>
                {mensagens.map((msg, index) => {
                  const isMinha = Number(msg.remetenteId) === Number(usuarioAtual?.id);
                  return (
                    <div key={index} className={`${styles.mensagemWrapper} ${isMinha ? styles.minhaMensagem : styles.outraMensagem}`}>
                      <div className={styles.balao}>
                        {msg.texto}
                      </div>
                      <span className={styles.hora}>
                        {new Date(msg.criadaEm).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                {/* Referência invisível para rolar sempre para o fim */}
                <div ref={mensagensFimRef} />
              </div>

              {/* Caixa de Escrever */}
              <div className={styles.inputArea}>
                <form onSubmit={enviarMensagem} className={styles.formChat}>
                  <input 
                    type="text" 
                    placeholder="Escreva a sua mensagem..." 
                    className={styles.inputMsg}
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                  />
                  <button type="submit" className={styles.btnEnviar} disabled={!texto.trim()}>
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>

      </div>
    </>
  );
}