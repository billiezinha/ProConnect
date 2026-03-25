"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import styles from './Chat.module.css';
import { io, Socket } from 'socket.io-client';
import api from '@/service/api';
import Navbar from '@/components/navbar/Navbar';
import { Send, User, MessageSquare, Phone } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getMe } from '@/service/userService';

export default function ChatPage() {
  return (
    <Suspense fallback={<div>A carregar chat...</div>}>
      <ChatContent />
    </Suspense>
  )
}

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversaIdParam = searchParams.get('conversaId');
  const profissionalIdParam = searchParams.get('profissionalId');

  const [usuarioAtual, setUsuarioAtual] = useState<any>(null);
  const [conversas, setConversas] = useState<any[]>([]);
  const [conversaAtiva, setConversaAtiva] = useState<any>(null);
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [texto, setTexto] = useState('');
  
  const socketRef = useRef<Socket | null>(null);
  const mensagensFimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Busca o user da API
    const token = localStorage.getItem('token'); 
    
    if (token) {
      getMe().then(user => {
        setUsuarioAtual(user);
        carregarConversas(user.id);

        // Liga-se ao servidor WebSocket
        socketRef.current = io("https://proconnectapi-2.onrender.com", {
          auth: { token }
        });
        
        socketRef.current.on("connect", () => console.log("Chat WS Conectado!"));
        socketRef.current.on("connect_error", (err) => console.error("Erro WS:", err));
      }).catch(err => {
         console.error("Erro ao carregar usuário atual:", err);
         router.push('/login');
      });

      // Limpa a conexão quando sai da página
      return () => {
        socketRef.current?.disconnect();
      };
    } else {
      router.push('/login');
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
      const conversasArray = res.data as any[];
      // CORREÇÃO: Avisamos o TypeScript que a resposta é um Array
      setConversas(conversasArray); 
      
      // Auto-abrir conversa se o parametro existir
      if (!conversaAtiva) {
        let convToOpen: any;
        if (conversaIdParam && conversaIdParam !== 'undefined') {
          convToOpen = conversasArray.find(c => String(c.id) === conversaIdParam);
        }
        if (!convToOpen && profissionalIdParam) {
          convToOpen = conversasArray.find(c => 
            String(c.profissionalId) === profissionalIdParam || 
            String(c.clienteId) === profissionalIdParam ||
            (c.profissional && String(c.profissional.id) === profissionalIdParam)
          );
        }

        if (!convToOpen && conversaIdParam && conversaIdParam !== 'undefined' && profissionalIdParam) {
           convToOpen = {
             id: Number(conversaIdParam),
             clienteId: userId,
             profissionalId: Number(profissionalIdParam),
             mensagens: []
           };
           // Adiciona à lista lateral visualmente
           setConversas(prev => [convToOpen, ...prev]);
        }

        if (convToOpen) {
          abrirConversa(convToOpen);
        }
      }
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

    // Atualização otimista: Mostra imediatamente no ecrã do remetente
    const mensagemOtimista = {
      ...dadosMensagem,
      criadaEm: new Date().toISOString()
    };
    
    setMensagens(prev => [...prev, mensagemOtimista]);

    // Envia a mensagem pelo WebSocket
    socketRef.current?.emit("enviar_mensagem", dadosMensagem);
    setTexto(''); // Limpa o input
  };

  // Função auxiliar para saber o nome da outra pessoa
  const obterNomeOutroUsuario = (conversa: any) => {
    if (!usuarioAtual) return "Desconhecido";
    if (conversa.clienteId === usuarioAtual.id) {
       return conversa.profissional?.nome || conversa.profissional?.nomeNegocio || "Profissional";
    } else {
       return conversa.cliente?.nome || "Cliente";
    }
  };

  return (
    <>
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
                  <div className={`${styles.avatarPlaceholder} ${conversaAtiva?.id === conv.id ? styles.avatarPlaceholderActive : ''}`}>
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
                <div className={styles.chatHeaderInfo}>
                  <div className={styles.avatarPlaceholder}>
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className={styles.chatHeaderName}>
                      {obterNomeOutroUsuario(conversaAtiva)}
                      <span className={`${styles.roleBadge} ${conversaAtiva.clienteId === usuarioAtual?.id ? styles.roleProfissional : styles.roleCliente}`}>
                        {conversaAtiva.clienteId === usuarioAtual?.id ? 'Profissional' : 'Cliente'}
                      </span>
                    </h3>
                  </div>
                </div>
                <div className={styles.chatHeaderActions}>
                  <button className={styles.iconButton} title="Ligar" onClick={() => alert("Ligar de momento indisponível.")}>
                     <Phone size={18} />
                  </button>
                </div>
              </div>

              {/* Lista de Mensagens */}
              <div className={styles.mensagensList}>
                {mensagens.map((msg, index) => {
                  const isMinha = Number(msg.remetenteId) === Number(usuarioAtual?.id);
                  const isProfissional = Number(msg.remetenteId) === Number(conversaAtiva.profissionalId);

                  if (isMinha) {
                    return (
                      <div key={index} className={`${styles.mensagemGeral} ${styles.mensagemWrapperMinha}`}>
                        <div className={`${styles.balao} ${styles.minhaMensagem}`}>
                          {msg.texto}
                        </div>
                        <span className={styles.hora}>
                          {new Date(msg.criadaEm).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  } else {
                    return (
                      <div key={index} className={styles.mensagemWrapperOutra}>
                        <div className={styles.avatarPlaceholder} style={{ width: '40px', height: '40px', margin: 0 }}>
                          <User size={18} />
                        </div>
                        <div className={styles.mensagemContentOutra}>
                          <span className={styles.nomeRemetente}>
                             {obterNomeOutroUsuario(conversaAtiva)} • {isProfissional ? 'Profissional' : 'Cliente'}
                          </span>
                          <div className={`${styles.balao} ${styles.outraMensagem}`}>
                            {msg.texto}
                          </div>
                          <span className={styles.hora}>
                            {new Date(msg.criadaEm).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  }
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