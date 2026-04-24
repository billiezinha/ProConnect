"use client";
import { useEffect } from "react";
import { FaExclamationTriangle, FaRedo } from "react-icons/fa";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Critical Render Error:", error);
  }, [error]);

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
      <FaExclamationTriangle size={80} style={{ color: '#ef4444', marginBottom: '2rem' }} />
      <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800 }}>Algo deu errado!</h1>
      <p style={{ color: 'var(--cor-texto-secundario, #64748b)', maxWidth: '500px', margin: '1rem 0 2rem 0' }}>
        Ocorreu um erro inesperado na aplicação. Nossa equipe já foi notificada (mentira, mas logo será!).
        <br/><br/>
        <span style={{ fontSize: '0.85rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>
          {error.message || "Erro interno"}
        </span>
      </p>
      
      <button 
        onClick={() => reset()}
        style={{
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '12px',
          fontWeight: 'bold',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 10px 20px rgba(239, 68, 68, 0.2)',
          transition: 'all 0.3s'
        }}
      >
        <FaRedo /> Tentar Novamente
      </button>
    </div>
  );
}
