"use client";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { getMe, uploadFotoPerfil, removerFotoPerfil, updateMe } from "@/service/userService"; // Certifique-se de criar o updateMe
import type { User } from "@/interfaces/UserProps";
import styles from "./page.module.css";
import { 
  FaUserCircle, FaPhone, FaMapMarkerAlt, 
  FaEdit, FaSignOutAlt, FaBriefcase, FaPlusCircle, FaClipboardList, FaCamera, FaTrash, FaCheckCircle, FaTimesCircle
} from "react-icons/fa";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Estados para edição
  const [editNome, setEditNome] = useState("");
  const [editTelefone, setEditTelefone] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const carregarUtilizador = async () => {
    try {
      const userData = await getMe();
      setUser(userData);
      setEditNome(userData.nome || "");
      setEditTelefone(userData.telefone || "");
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

  // FUNÇÃO PARA ALTERAR DISPONIBILIDADE
  const toggleDisponibilidade = async () => {
    if (!user) return;
    try {
      const novoStatus = !user.disponivel;
      await updateMe({ disponivel: novoStatus });
      setUser({ ...user, disponivel: novoStatus });
      toast.success(novoStatus ? "Você está disponível!" : "Você está offline.");
    } catch (error) {
      toast.error("Erro ao alterar status.");
    }
  };

  // FUNÇÃO PARA SALVAR EDIÇÃO DE PERFIL
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMe({ nome: editNome, telefone: editTelefone });
      toast.success("Perfil atualizado com sucesso!");
      setIsEditModalOpen(false);
      carregarUtilizador();
    } catch (error) {
      toast.error("Erro ao atualizar perfil.");
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("imagem", file);
    setUploading(true);
    try {
      await uploadFotoPerfil(formData);
      toast.success("Foto atualizada!");
      await carregarUtilizador();
    } catch {
      toast.error("Erro ao atualizar foto.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className={styles.loadingState}>A carregar painel...</div>;

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
                <button className={styles.avatarBtn} onClick={() => fileInputRef.current?.click()}><FaCamera /></button>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: "none" }} />
            </div>
            
            <h2>{user?.nome}</h2>
            <p className={styles.userEmail}>{user?.email}</p>

            {/* BOTÃO DE DISPONIBILIDADE */}
            <div className={styles.statusSection}>
               <button 
                onClick={toggleDisponibilidade}
                className={`${styles.statusToggle} ${user?.disponivel ? styles.online : styles.offline}`}
               >
                 {user?.disponivel ? <FaCheckCircle /> : <FaTimesCircle />}
                 {user?.disponivel ? "Disponível" : "Indisponível"}
               </button>
            </div>
          </div>

          <button onClick={handleLogout} className={styles.logoutBtn}><FaSignOutAlt /> Sair</button>
        </aside>

        <main className={styles.content}>
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h3><FaUserCircle /> Dados Pessoais</h3>
              <button onClick={() => setIsEditModalOpen(true)} className={styles.editBtn}><FaEdit /> Editar Perfil</button>
            </div>
            <div className={styles.infoGrid}>
              <div className={styles.infoBox}><label><FaPhone /> Telefone</label><span>{user?.telefone || "Não cadastrado"}</span></div>
              <div className={styles.infoBox}><label><FaMapMarkerAlt /> Localização</label><span>{user?.cidade || "Picos"}, {user?.estado || "PI"}</span></div>
            </div>
          </section>

          <div className={styles.quickActions}>
            <div onClick={() => router.push("/meus-servicos")} className={styles.actionCard}><FaBriefcase /><h4>Meus Serviços</h4></div>
            <div onClick={() => router.push("/cadastro-servico")} className={styles.actionCard}><FaPlusCircle /><h4>Novo Serviço</h4></div>
          </div>
        </main>
      </div>

      {/* MODAL DE EDIÇÃO */}
      {isEditModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
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
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsEditModalOpen(false)}>Cancelar</button>
                <button type="submit" className={styles.saveBtn}>Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}