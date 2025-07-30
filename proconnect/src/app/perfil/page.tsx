'use client'

import styles from './page.module.css'
import { useEffect, useState } from 'react'

type Usuario = {
  nome: string
  email: string
  telefone: string
  estado: string
  cidade: string
  endereco: string
  servico: string
}

export default function EditarPerfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)

  useEffect(() => {
    // Substitua por ID real (ex: vindo do cookie ou auth)
    const userId = 'clxyz123abc'
    fetch(`/api/usuario/${userId}`)
      .then(res => res.json())
      .then(data => setUsuario(data))
  }, [])

  if (!usuario) return <div>Carregando...</div>

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <img src="https://via.placeholder.com/100" alt="User Icon" />
        <div className={styles.info}>📞 {usuario.telefone}</div>
        <div className={styles.info}>✉️ {usuario.email}</div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.closeBtn}>X</div>
        <h2>EDITAR PERFIL</h2>

        <div className={styles.formGroup}>
          <label>Nome</label>
          <input type="text" value={usuario.nome} readOnly />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Estado</label>
            <input type="text" value={usuario.estado} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label>Cidade</label>
            <input type="text" value={usuario.cidade} readOnly />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Endereço</label>
          <input type="text" value={usuario.endereco} readOnly />
        </div>

        <div className={styles.formGroup}>
          <label>Serviço</label>
          <div className={styles.servicoGroup}>
            <span>{usuario.servico}</span>
            <button className={styles.iconBtn}>🗑️</button>
            <button className={styles.iconBtn}>✏️</button>
          </div>
        </div>

        <div className={styles.buttons}>
          <button className={`${styles.btn} ${styles.btnExcluir}`}>EXCLUIR</button>
          <button className={`${styles.btn} ${styles.btnSalvar}`}>SALVAR</button>
        </div>
      </div>
    </div>
  )
}
