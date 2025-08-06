"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUser } from '@/service/userService'; // Vamos precisar de ir buscar o utilizador
import { User } from '@/interfaces/UserProps';
import styles from './perfil.module.css';
import { FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';

// Supõe que o token JWT tem um 'sub' (subject) com o ID do utilizador
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string; // O ID do utilizador está aqui
  // ... outras propriedades do token
}

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // Se não houver token, redireciona para o login
        router.push('/login');
        return;
      }

      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        const userId = parseInt(decodedToken.sub, 10); // Converte o ID para número

        if (isNaN(userId)) {
          throw new Error("ID de utilizador inválido no token.");
        }

        const userData = await getUser(userId);
        setUser(userData);
      } catch (err) {
        console.error("Erro ao ir buscar dados do utilizador:", err);
        setError("Não foi possível carregar os seus dados. Por favor, tente fazer login novamente.");
        // Limpa o token inválido e redireciona
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return <div className={styles.loadingState}>A carregar o seu perfil...</div>;
  }

  if (error) {
    return <div className={styles.errorState}>{error}</div>;
  }

  return (
    <div className={styles.body}>
      <header className={styles.header}>
        <div className={styles.container}>
          <h1 className={styles.headerTitle}>Meu Perfil</h1>
          <button onClick={() => {
            localStorage.removeItem('token');
            router.push('/login');
          }} className={styles.logoutButton}>
            Sair
          </button>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.container}>
          {user && (
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <FaUserCircle className={styles.profileIcon} />
                <h2 className={styles.profileName}>{user.nome}</h2>
                <Link href="/perfil/editar" className={styles.editButton}>
                  <FaEdit /> Editar Perfil
                </Link>
              </div>

              <div className={styles.profileDetails}>
                <h3 className={styles.sectionTitle}>Informações de Contato</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <FaEnvelope />
                    <span>{user.email}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <FaPhone />
                    <span>{user.telefone || 'Não informado'}</span>
                  </div>
                </div>
                
                <h3 className={styles.sectionTitle}>Localização</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <FaMapMarkerAlt />
                    <span>{`${user.cidade || 'Não informada'}, ${user.estado || 'Não informado'}`}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.actionsGrid}>
            <Link href="/meus-servicos" className={styles.actionCard}>
              <h3>Meus Serviços</h3>
              <p>Ver e gerir os seus serviços anunciados</p>
            </Link>
            <Link href="/cadastro-servico" className={styles.actionCard}>
              <h3>Anunciar Novo Serviço</h3>
              <p>Crie um novo anúncio para atrair clientes</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}