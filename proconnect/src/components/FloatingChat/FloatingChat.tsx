"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import styles from './FloatingChat.module.css';
import { io, Socket } from 'socket.io-client';
import api from '@/service/api';
import { Send, MessageSquare, X, ChevronLeft, User, Phone } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { getMe } from '@/service/userService';
import toast from 'react-hot-toast';

// Exportado com Suspense para não quebrar a Build no Next.js ao usar useSearchParams()
export default function FloatingChat() {
  return (
    <Suspense fallback={null}>
      <FloatingChatContent />
    </Suspense>
  )
}

function FloatingChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const chatOpenParam = searchParams.get('chatOpen');
  const conversaIdParam = searchParams.get('conversaId');
  const profissionalIdParam = searchParams.get('profissionalId');

  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mensagensNaoLidas, setMensagensNaoLidas] = useState<Record<number, number>>({});

  const [usuarioAtual, setUsuarioAtual] = useState<any>(null);
  const [conversas, setConversas] = useState<any[]>([]);
  const [conversaAtiva, setConversaAtiva] = useState<any>(null);
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [texto, setTexto] = useState('');
  const [abaAtiva, setAbaAtiva] = useState<'cliente' | 'profissional'>('cliente');
  
  const socketRef = useRef<Socket | null>(null);
  const mensagensFimRef = useRef<HTMLDivElement>(null);
  const rawConversasRef = useRef<any[]>([]); // Guarda AS TODAS (incluindo as fantasma geradas com 0 mensagens)

  // Observa os URL Params para auto-abrir o widget se ativado de fora
  useEffect(() => {
    if (chatOpenParam === 'true') {
      setIsOpen(true);
      
      if (!usuarioAtual) return; // Espera que o user carregue

      const startResolvingConversation = async () => {
        let convToOpen: any;
        
        // Procuramos primeiro NO CACHE TOTAL para garantir que achamos os IDs originais das conversas acabadas de criar
        if (conversaIdParam && conversaIdParam !== 'undefined') {
          convToOpen = rawConversasRef.current.find(c => String(c.id) === conversaIdParam);
        }
        if (!convToOpen && profissionalIdParam) {
          convToOpen = rawConversasRef.current.find(c => 
            String(c.profissionalId) === profissionalIdParam || 
            String(c.clienteId) === profissionalIdParam ||
            (c.profissional && String(c.profissional.id) === profissionalIdParam)
          );
        }

        // Se ainda não achámos (foi criada há 5ms na página de busca), fazemos sync com DB real
        if (!convToOpen && profissionalIdParam) {
           try {
             await carregarConversas(usuarioAtual.id); // Força refresh da rawConversasRef
             
             convToOpen = rawConversasRef.current.find(c => 
               String(c.profissionalId) === profissionalIdParam || 
               String(c.clienteId) === profissionalIdParam ||
               (c.profissional && String(c.profissional.id) === profissionalIdParam)
             );
           } catch(err) {
             console.error("Falha ao re-syncar o background das salas ativas.", err);
           }
        }

        // Se MESMO ASSIM falhar, recorre à fantasma com ID provisional apenas para não crashar a UI
        if (!convToOpen && profissionalIdParam) {
           convToOpen = {
             id: (conversaIdParam && conversaIdParam !== 'undefined') ? Number(conversaIdParam) : Date.now(),
             clienteId: usuarioAtual.id,
             profissionalId: Number(profissionalIdParam),
             profissional: {
               id: Number(profissionalIdParam),
               nome: searchParams.get('profissionalNome') || "Profissional",
               imagem: searchParams.get('profissionalImg') || null
             },
             mensagens: []
           };
           
           // Injetamos na lista visual
           setConversas(prev => {
              if (!prev.find(p => p.id === convToOpen.id)) {
                return [convToOpen, ...prev];
              }
              return prev;
           });
        }

        // Abre a conversa apenas se não for já a ativa
        setConversaAtiva((prev: any) => {
          if (convToOpen && (!prev || prev.id !== convToOpen.id)) {
            setTimeout(() => abrirConversa(convToOpen), 0);
          }
          return prev;
        });
      };

      startResolvingConversation();
    }
  }, [chatOpenParam, conversaIdParam, profissionalIdParam, usuarioAtual]);

  // Pede permissão para notificações nativas do Browser ao carregar o chat
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  }, []);

  // Carrega utilzador e estabelece WS
  useEffect(() => {
    const token = localStorage.getItem('token'); 
    
    if (token) {
      getMe().then(user => {
        setUsuarioAtual(user);
        carregarConversas(user.id);

        socketRef.current = io("https://proconnectapi-2.onrender.com", {
          auth: { token }
        });
        
        socketRef.current.on("connect", () => console.log("Floating Chat WS Conectado!"));
        socketRef.current.on("connect_error", (err) => console.error("Erro WS:", err));
      }).catch(err => {
         console.warn("Erro ao autenticar Floating Chat silenciosamente:", err);
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, []);

  // Escuta novas mensagens
  useEffect(() => {
    if (!socketRef.current) return;

    const lidarComNovaMensagem = (novaMensagem: any) => {
      // Se a aba do browser não estiver visível ou a janela de chat estiver minimizada
      const isBackground = document.hidden || !isOpen;

      // Se não enviámos nós
      const isOutraPessoa = novaMensagem.remetenteId !== usuarioAtual?.id;

      if (conversaAtiva && novaMensagem.conversaId === conversaAtiva.id) {
        setMensagens((prev) => [...prev, novaMensagem]);
        // Atualiza a timestamp de leitura porque a conversa está literalmente aberta na sua cara
        if (typeof window !== 'undefined') {
          localStorage.setItem(`@ProConnect:ChatRead:${conversaAtiva.id}`, String(Date.now()));
        }
      } else if (isOutraPessoa) {
        // Se a pessoa receber uma mensagem, e não a tiver aberta ativa no momento, damos trigger à notificação
        setMensagensNaoLidas(prev => ({
          ...prev,
          [novaMensagem.conversaId]: (prev[novaMensagem.conversaId] || 0) + 1
        }));
        
        // Push a conversa para o topo ativando uma re-ordenação na rawConversasRef
        setConversas(prevConversas => {
          const arr = [...prevConversas];
          const indiceDaConversa = arr.findIndex(c => c.id === novaMensagem.conversaId);
          if (indiceDaConversa > -1) {
             const [conversaRemovida] = arr.splice(indiceDaConversa, 1);
             // Salva a mensagem como a "ultima" visível no preview do card
             conversaRemovida.mensagens = [novaMensagem, ...(conversaRemovida.mensagens || [])];
             arr.unshift(conversaRemovida);
          }
          return arr;
        });

        setUnreadCount(prev => prev + 1);
      }

      // Dispara a Notificação Deskop / Toast se não estivermos focados
      if (isBackground && isOutraPessoa) {
        // Envia notificação interna (Toast) se a app estiver aberta mas o widget minimizado
        if (!document.hidden) {
          toast('Nova mensagem recebida!', { icon: '💬', duration: 4000 });
        }
        
        // Envia notificação nativa do Windows/MacOS se tiver permissão
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification("ProConnect Chat", {
            body: novaMensagem.texto || "Tem uma nova mensagem à sua espera.",
            icon: '/icon.png' // Se não existir logo, o SO ignora ou usa default
          });
        }
      }
    };

    socketRef.current.on("nova_mensagem", lidarComNovaMensagem);

    return () => {
      socketRef.current?.off("nova_mensagem", lidarComNovaMensagem);
    };
  }, [conversaAtiva, isOpen, usuarioAtual]);

  // Rola para o fundo sempre que há novas mensagens
  useEffect(() => {
    mensagensFimRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens, isOpen, conversaAtiva]);

  const carregarConversas = async (userId: number) => {
    try {
      const res = await api.get(`/chat/usuario/${userId}`);
      const conversasArray = res.data as any[];
      
      rawConversasRef.current = conversasArray;

      // FILTRAR CONVERSAS VAZIAS E CALCULAR UNREAD COUNTS
      const conversasComHistorico = conversasArray.filter(c => c.mensagens && c.mensagens.length > 0);
      
      if (typeof window !== 'undefined') {
         let globNaoLidas = 0;
         const mapNaoLidas: Record<number, number> = {};
         
         conversasComHistorico.forEach(c => {
           const lastRead = Number(localStorage.getItem(`@ProConnect:ChatRead:${c.id}`) || 0);
           let counter = 0;
           
           if (c.mensagens) {
             // Conta todas as mensagens que sejam (DELE) e (CRIADAS DEPOIS DA ULTIMA VEZ QUE ABRIMOS O CHAT)
             c.mensagens.forEach((m: any) => {
               if (m.remetenteId !== userId && new Date(m.criadaEm).getTime() > lastRead) {
                 counter++;
               }
             });
           }
           mapNaoLidas[c.id] = counter;
           globNaoLidas += counter;
         });

         setUnreadCount(globNaoLidas);
         setMensagensNaoLidas(mapNaoLidas);
      }
      
      // Ordena por atividade mais recente (timestamp da última mensagem)
      conversasComHistorico.sort((a,b) => {
         const timeA = a.mensagens?.[0]?.criadaEm ? new Date(a.mensagens[0].criadaEm).getTime() : 0;
         const timeB = b.mensagens?.[0]?.criadaEm ? new Date(b.mensagens[0].criadaEm).getTime() : 0;
         return timeB - timeA;
      });

      setConversas(conversasComHistorico); 
    } catch (error) {
      console.error("Erro ao carregar conversas do Floating Chat", error);
    }
  };

  const abrirConversa = async (conversa: any) => {
    setConversaAtiva(conversa);
    socketRef.current?.emit("entrar_conversa", conversa.id);
    
    // Zera contagens da conversa atual quando entra para a tela
    if (typeof window !== 'undefined') {
      localStorage.setItem(`@ProConnect:ChatRead:${conversa.id}`, String(Date.now()));
      
      setMensagensNaoLidas(prev => {
        const estadoAtualizado = { ...prev };
        const decremento = estadoAtualizado[conversa.id] || 0;
        
        estadoAtualizado[conversa.id] = 0;
        setUnreadCount(c => Math.max(0, c - decremento)); // Previne Math negativo de ghost states
        return estadoAtualizado;
      });
    }

    try {
      setMensagens(conversa.mensagens || []);
      const res = await api.get(`/chat/${conversa.id}/mensagens`);
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

    // Atualização otimista
    const mensagemOtimista = {
      ...dadosMensagem,
      criadaEm: new Date().toISOString()
    };
    setMensagens(prev => [...prev, mensagemOtimista]);
    
    // Se a enviámos e a conversa está aberta, então garantidamente visualizámos o histórico
    if (typeof window !== 'undefined') {
       localStorage.setItem(`@ProConnect:ChatRead:${conversaAtiva.id}`, String(Date.now()));
    }

    socketRef.current?.emit("enviar_mensagem", dadosMensagem);
    setTexto('');
  };

  // Botão Fechar o Widget Inteiro
  const closeWidget = () => {
    setIsOpen(false);
    // Limpar os queryparams do URL para não reabrir a cada refresh
    if (chatOpenParam) {
      router.replace(pathname); // Volta à versão limpa da página atual
    }
  };

  // Botão Voltar para a lista lateral
  const backToList = () => {
    setConversaAtiva(null);
  };

  const obterNomeOutroUsuario = (conversa: any) => {
    if (!usuarioAtual) return "Desconhecido";
    if (conversa.clienteId === usuarioAtual.id) {
       return conversa.profissional?.nome || conversa.profissional?.nomeNegocio || "Profissional";
    } else {
       return conversa.cliente?.nome || "Cliente";
    }
  };

  const acionarAvaliacaoModal = (profissionalId: number) => {
    if (typeof window !== 'undefined') {
      const meta = localStorage.getItem(`@ProConnect:ChatMetaData:${profissionalId}`);
      if (meta) {
        const parsed = JSON.parse(meta);
        localStorage.setItem("@ProConnect:avaliar", JSON.stringify({ id: parsed.servicoId, nome: parsed.nome }));
        window.dispatchEvent(new Event("focus")); // Acorda o AvaliacaoPendente
        toast.success("Formulário de avaliação aberto!");
      } else {
        toast.error("Serviço original não encontrado. Não é possível avaliar a partir deste dispositivo.");
      }
    }
  };

  const finalizarServico = () => {
    if (!conversaAtiva || !usuarioAtual) return;
    
    const dadosMensagem = {
      conversaId: conversaAtiva.id,
      remetenteId: usuarioAtual.id,
      texto: "@@SYSTEM_EVAL_REQ@@"
    };

    setMensagens(prev => [...prev, { ...dadosMensagem, criadaEm: new Date().toISOString() }]);
    socketRef.current?.emit("enviar_mensagem", dadosMensagem);
    toast.success("Pedido de avaliação enviado ao cliente!");
  };

  const obterImagemOutroUsuario = (conversa: any) => {
    if (!usuarioAtual) return null;
    if (conversa.clienteId === usuarioAtual.id) {
       return conversa.profissional?.imagem || null;
    } else {
       return conversa.cliente?.imagem || null;
    }
  };

  // Se não está logado de todo, e não estamos escondidos, esconde globalmente o widget?
  // O utilizador pode querer ver que existe chat. Renderizamos sempre o FAB, 
  // mas se eles clicarem pedimos login? O botão FAB nem aparece se usuarioAtual = null e token não existir.
  const hasToken = typeof window !== 'undefined' ? !!localStorage.getItem('token') : false;
  
  if (!hasToken && !usuarioAtual) return null;

  const conversasFiltradas = conversas.filter(conv => {
    if (!usuarioAtual) return false;
    if (abaAtiva === 'cliente') {
      return conv.clienteId === usuarioAtual.id; // Profissionais que contactei
    } else {
      return conv.profissionalId === usuarioAtual.id; // Clientes que me contactaram
    }
  });

  return (
    <div className={styles.floatingWrapper}>
      {/* PAINEL DO CHAT (Pop-up) */}
      <div className={`${styles.chatPanel} ${isOpen ? styles.chatPanelOpen : ''}`}>
        
        {/* --- CABEÇALHO GERAL --- */}
        <div className={styles.panelHeader} style={{ flexDirection: 'column', padding: 0, alignItems: 'stretch' }}>
          
          {/* Top Row: Title/Back & Close Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', width: '100%' }}>
            {!conversaAtiva ? (
              <div className={styles.panelHeaderTitle}>
                <MessageSquare size={20} color="#8B2CF5" />
                <h3>Minhas Mensagens</h3>
              </div>
            ) : (
              <div className={styles.activeChatHeaderInfo}>
                <button 
                  className={styles.btnBack} 
                  onClick={backToList}
                  title="Voltar"
                >
                  <ChevronLeft size={20} />
                </button>
                <div style={{ marginLeft: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className={styles.avatarPlaceholder} style={{ width: '32px', height: '32px', margin: 0 }}>
                    {obterImagemOutroUsuario(conversaAtiva) ? (
                      <img src={obterImagemOutroUsuario(conversaAtiva)} alt="Avatar" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', margin: 0 }}>{obterNomeOutroUsuario(conversaAtiva)}</h3>
                  </div>
                </div>
                {/* Botão de Finalizar Serviço para o Profissional */}
                <div style={{ marginLeft: 'auto' }}>
                  {abaAtiva === 'profissional' && (
                    <button 
                       className={styles.btnConcluir} 
                       onClick={finalizarServico}
                       title="Marcar serviço como concluído e pedir avaliação"
                    >
                      ✔️ Concluir
                    </button>
                  )}
                </div>
              </div>
            )}
            
            <button className={styles.btnClose} onClick={closeWidget}>
              <X size={20} />
            </button>
          </div>

          {/* Bottom Row: Tabs */}
          {!conversaAtiva && (
            <div className={styles.tabsContainer}>
              <button 
                className={`${styles.tabBtn} ${abaAtiva === 'cliente' ? styles.tabActive : ''}`}
                onClick={() => setAbaAtiva('cliente')}
              >
                Minhas Contratações
              </button>
              <button 
                className={`${styles.tabBtn} ${abaAtiva === 'profissional' ? styles.tabActive : ''}`}
                onClick={() => setAbaAtiva('profissional')}
              >
                Meus Clientes
              </button>
            </div>
          )}
        </div>

        {/* --- CORPO DA JANELA --- */}
        {!conversaAtiva ? (
          // ECRÃ 1: LISTA DE CONVERSAS
          <div className={styles.conversasList}>
            {conversasFiltradas.length === 0 ? (
              <div className={styles.emptyConversations}>
                <MessageSquare size={48} opacity={0.2} />
                <span>Nenhuma conversa ativa nesta secção.</span>
              </div>
            ) : (
              conversasFiltradas.map((conv) => (
                <div 
                  key={conv.id} 
                  className={styles.conversaItem}
                  onClick={() => abrirConversa(conv)}
                >
                  <div className={styles.avatarPlaceholder}>
                    {obterImagemOutroUsuario(conv) ? (
                      <img src={obterImagemOutroUsuario(conv)} alt="Avatar" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <div className={styles.conversaInfo}>
                    <div className={styles.conversaNomeRow}>
                      <span className={styles.conversaNome}>
                        {obterNomeOutroUsuario(conv)}
                      </span>
                      {mensagensNaoLidas[conv.id] > 0 && (
                        <div className={styles.bolinhaNaoLida}>
                          {mensagensNaoLidas[conv.id] > 9 ? '9+' : mensagensNaoLidas[conv.id]}
                        </div>
                      )}
                    </div>
                    <div className={`${styles.ultimaMensagem} ${mensagensNaoLidas[conv.id] > 0 ? styles.fontBoldBlack : ''}`}>
                      {conv.mensagens && conv.mensagens.length > 0 
                        ? conv.mensagens[0].texto 
                        : "Nova mensagem ativa..."}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // ECRÃ 2: O CHAT COM A PESSOA
          <>
            <div className={styles.mensagensList}>
              {mensagens.map((msg, index) => {
                
                // INTERCETAR MENSAGENS DE SISTEMA (AVALIAÇÃO)
                if (msg.texto === "@@SYSTEM_EVAL_REQ@@") {
                  return (
                    <div key={index} className={styles.systemBubble}>
                      <div className={styles.systemIcon}>⭐</div>
                      <h4 style={{ margin: '8px 0 4px 0', fontSize: '0.9rem' }}>Serviço Concluído</h4>
                      <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: 'var(--cor-texto-secundario)', textAlign: 'center' }}>
                        O profissional marcou o serviço como concluído.
                      </p>
                      {abaAtiva === 'cliente' ? (
                        <button 
                          className={styles.btnSystemAvaliar}
                          onClick={() => acionarAvaliacaoModal(conversaAtiva.profissionalId)}
                        >
                          Avaliar Agora
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>O cliente foi notificado para avaliar.</span>
                      )}
                    </div>
                  );
                }

                const isMinha = Number(msg.remetenteId) === Number(usuarioAtual?.id);
                if (isMinha) {
                  return (
                    <div key={index} className={styles.mensagemWrapperMinha}>
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
                      <div className={styles.avatarPlaceholder} style={{ width: '28px', height: '28px', margin: 0 }}>
                        {obterImagemOutroUsuario(conversaAtiva) ? (
                          <img src={obterImagemOutroUsuario(conversaAtiva)} alt="Avatar" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                        ) : (
                          <User size={14} />
                        )}
                      </div>
                      <div className={styles.mensagemContentOutra}>
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
              <div ref={mensagensFimRef} />
            </div>

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
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      {/* BOTÃO FLUTUANTE (FAB) */}
      <button 
        className={`${styles.fabButton} ${unreadCount > 0 && !isOpen ? styles.fabButtonUnread : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Abrir Chat"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {unreadCount > 0 && !isOpen && (
          <div className={styles.unreadBadge}>{unreadCount > 9 ? '9+' : unreadCount}</div>
        )}
      </button>
    </div>
  );
}
