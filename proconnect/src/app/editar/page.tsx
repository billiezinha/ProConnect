'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function EditarPerfil() {
  const [nome, setNome] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [endereco, setEndereco] = useState('');
  const [servico, setServico] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPerfil() {
      try {
        const res = await fetch('/api/usuario/perfil');
        if (!res.ok) throw new Error('Erro ao buscar perfil');
        const data = await res.json();

        setNome(data.nome);
        setEstado(data.estado);
        setCidade(data.cidade);
        setEndereco(data.endereco);
        setServico(data.servico);
      } catch (err) {
        console.error(err);
        alert('Erro ao carregar os dados do perfil.');
      } finally {
        setLoading(false);
      }
    }

    fetchPerfil();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/usuario/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, estado, cidade, endereco, servico }),
      });

      if (!res.ok) throw new Error('Erro ao salvar perfil');
      alert('Perfil atualizado com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar perfil.');
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.avatar}></div>
        <p className={styles.sidebarText}>
          📞 (XX) XXXXX-XXXX
        </p>
        <p className={styles.sidebarText}>
          ✉️ exemplo@gmail.com
        </p>
      </div>

      <div className={styles.form}>
        <button type="button" className={styles.closeBtn} onClick={() => alert('Fechar modal')}>
          X
        </button>
        <h2 className={styles.titulo}>EDITAR PERFIL</h2>
        <form onSubmit={handleSubmit}>
          <input
            className={styles.input}
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <div className={styles.row}>
            <input
              className={styles.input}
              placeholder="Estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            />
            <input
              className={styles.input}
              placeholder="Cidade"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
          </div>
          <input
            className={styles.input}
            placeholder="Endereço"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
          <div className={styles.servicoField}>
            <input
              className={styles.servicoInput}
              placeholder="Serviço"
              value={servico}
              onChange={(e) => setServico(e.target.value)}
            />
            <span className={styles.icons}>
              <span onClick={() => setServico('')} className={styles.clickableIcon}>
                🗑️
              </span>
              <span onClick={() => alert('Editar serviço')} className={styles.clickableIcon}>
                ✏️
              </span>
            </span>
          </div>
          <div className={styles.buttons}>
            <button type="button" className={styles.excluir} onClick={() => alert('Excluir perfil')}>
              EXCLUIR
            </button>
            <button type="submit" className={styles.salvar}>
              SALVAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
