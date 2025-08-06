"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getServicos } from '@/service/servicoService';
import { Servico } from '@/interfaces/ServicoProps';
import styles from './page.module.css';
import { FaSearch, FaUserCircle } from 'react-icons/fa';

export default function BuscaProfissionaisPage() {
  const router = useRouter();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const data = await getServicos();
        setServicos(data);
      } catch (err) {
        console.error("Erro ao ir buscar serviços:", err);
        setError("Não foi possível carregar os serviços. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchServicos();
  }, []);

  // Filtra os serviços com base no termo de pesquisa
  const filteredServicos = useMemo(() => {
    if (!searchTerm) {
      return servicos;
    }
    return servicos.filter(servico =>
      servico.nomeNegocio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servico.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servico.categoria.nomeServico.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, servicos]);

  return (
    <div className={styles.body}>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>ProConnect</Link>
          <div className={styles.searchBar}>
            <FaSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Pesquisar por serviço, categoria ou profissional..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <nav>
            <Link href="/perfil" className={styles.profileLink}>
              <FaUserCircle />
              <span>Meu Perfil</span>
            </Link>
          </nav>
        </div>
      </header>
      
      <main className={styles.mainContent}>
        <div className={styles.container}>
          {loading && <p className={styles.loadingState}>A carregar profissionais...</p>}
          {error && <p className={styles.errorState}>{error}</p>}
          
          {!loading && !error && (
            <>
              <h1 className={styles.pageTitle}>Profissionais Disponíveis</h1>
              {filteredServicos.length > 0 ? (
                <div className={styles.grid}>
                  {filteredServicos.map(servico => (
                    <div key={servico.id} className={styles.card}>
                      <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>{servico.nomeNegocio}</h2>
                        <span className={styles.cardCategory}>{servico.categoria.nomeServico}</span>
                      </div>
                      <p className={styles.cardDescription}>{servico.descricao}</p>
                      <div className={styles.cardFooter}>
                        <div className={styles.userInfo}>
                          <FaUserCircle />
                          <span>{servico.usuario.nome}</span>
                        </div>
                        <Link href={`/servico/${servico.id}`} className={styles.detailsButton}>
                          Ver Detalhes
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noResults}>Nenhum serviço encontrado para a sua pesquisa.</p>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}