"use client";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { getMe, uploadFotoPerfil, updateMe } from "@/service/userService";
import type { User } from "@/interfaces/UserProps";
import styles from "./page.module.css";
import { 
  FaUserCircle, FaPhone, FaMapMarkerAlt, 
  FaEdit, FaSignOutAlt, FaBriefcase, FaPlusCircle, FaCamera, FaCheckCircle, FaTimesCircle
} from "react-icons/fa";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { LoadingProfile } from "@/components/loading/Loading";

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [editNome, setEditNome] = useState("");
  const [editTelefone, setEditTelefone] = useState("");
  const [editCidade, setEditCidade] = useState("");
  const [editEstado, setEditEstado] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const carregarUtilizador = async () => {
    try {
      const userData = await getMe();
      setUser(userData);
      setEditNome(userData.nome || "");
      setEditTelefone(userData.telefone || "");
      setEditCidade(userData.cidade || "");
      setEditEstado(userData.estado || "");
    } catch {
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarUtilizador(); }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    Cookies.remove("token");
    router.replace("/login");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await updateMe(user.id, { 
        nome: editNome, 
        telefone: editTelefone,
        cidade: editCidade,
        estado: editEstado.toUpperCase() 
      });
      toast.success("Perfil atualizado!");
      setIsEditModalOpen(false);
      await carregarUtilizador();
    } catch {
      toast.error("Erro ao atualizar.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingProfile />;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <div className={styles.userCore}>
            <div className={styles.avatarContainer}>
              {user?.imagem ? (
                <img src={user.imagem} alt="Perfil" className={styles.avatarImg} />
              ) : (
                <FaUserCircle className={styles.avatarPlaceholder} />
              )}
              <div className={styles.avatarOverlay}>
                <button className={styles.avatarBtn} onClick={() => fileInputRef.current?.click()}>
                  <FaCamera />
                </button>
              </div>
            </div>
            <h2>{user?.nome}</h2>
            <p className={styles.userEmail}>{user?.email}</p>

            <div className={styles.statusSection}>
               <button className={`${styles.statusToggle} ${user?.disponivel ? styles.online : styles.offline}`}>
                 {user?.disponivel ? <FaCheckCircle /> : <FaTimesCircle />}
                 {user?.disponivel ? "Disponível" : "Indisponível"}
               </button>
            </div>
          </div>

          <button onClick={handleLogout} className={styles.logoutBtn}>
            <FaSignOutAlt /> Sair da Conta
          </button>
        </aside>

        <main className={styles.content}>
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h3><FaUserCircle /> Dados Pessoais</h3>
              <button onClick={() => setIsEditModalOpen(true)} className={styles.editBtn}>
                <FaEdit /> Editar Perfil
              </button>
            </div>
            <div className={styles.infoGrid}>
              <div className={styles.infoBox}>
                <label><FaPhone /> Telefone</label>
                <span>{user?.telefone || "Não cadastrado"}</span>
              </div>
              <div className={styles.infoBox}>
                <label><FaMapMarkerAlt /> Localização</label>
                <span>{user?.cidade || "Cidade"}, {user?.estado || "UF"}</span>
              </div>
            </div>
          </section>

          <div className={styles.quickActions}>
            <div onClick={() => router.push("/meus-servicos")} className={styles.actionCard}>
              <FaBriefcase /><h4>Meus Serviços</h4>
            </div>
            <div onClick={() => router.push("/cadastro-servico")} className={styles.actionCard}>
              <FaPlusCircle /><h4>Novo Serviço</h4>
            </div>
          </div>
        </main>
      </div>

      {isEditModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsEditModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Editar Perfil</h3>
            <form onSubmit={handleSaveProfile}>
              <div className={styles.formGroup}>
                <label>Nome Completo</label>
                <input value={editNome} onChange={(e) => setEditNome(e.target.value)} required />
              </div>
              <div className={styles.formGroup}>
                <label>Telefone</label>
                <input value={editTelefone} onChange={(e) => setEditTelefone(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className={styles.formGroup} style={{ flex: 2 }}>
                  <label>Cidade</label>
                  <input value={editCidade} onChange={(e) => setEditCidade(e.target.value)} required />
                </div>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label>UF</label>
                  <input value={editEstado} onChange={(e) => setEditEstado(e.target.value.toUpperCase())} maxLength={2} required />
                </div>
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsEditModalOpen(false)}>Cancelar</button>
                <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                  {isSaving ? "A guardar..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}