"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DeprecatedChatPage() {
  const router = useRouter();

  useEffect(() => {
    // O sistema de chat agora é um Widget Global flutuante
    // Se alguém aceder à página velha /chat, é recambiado para a busca com o Chat Aberto
    router.replace('/Busca-profissionais?chatOpen=true');
  }, [router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>A carregar o novo sistema de Chat Flutuante...</p>
    </div>
  );
}