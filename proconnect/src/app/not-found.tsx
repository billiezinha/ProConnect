"use client";
import Link from "next/link";
import { FaGhost, FaArrowLeft } from "react-icons/fa";

export default function NotFound() {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '2rem',
      background: 'var(--cor-fundo-site, #f8fafc)',
      color: 'var(--cor-texto, #0f172a)'
    }}>
      <FaGhost size={80} style={{ color: '#8B2CF5', marginBottom: '2rem', animation: 'bounce 2s infinite' }} />
      <h1 style={{ fontSize: '4rem', margin: 0, fontWeight: 800 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Ops! Página não encontrada.</h2>
      <p style={{ color: 'var(--cor-texto-secundario, #64748b)', maxWidth: '500px', marginBottom: '2rem' }}>
        Parece que você acessou um link quebrado ou a página foi removida.
        Não se preocupe, vamos te levar de volta para a segurança.
      </p>
      
      <Link href="/" style={{
        background: 'linear-gradient(135deg, #8B2CF5, #d946ef)',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '12px',
        fontWeight: 'bold',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 10px 20px rgba(139, 44, 245, 0.2)',
        transition: 'all 0.3s'
      }}>
        <FaArrowLeft /> Voltar para o Início
      </Link>
    </div>
  );
}
