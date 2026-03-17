"use client";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { getMe, uploadFotoPerfil, removerFotoPerfil, updateMe } from "@/service/userService";
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // ✨ ESTADOS PARA EDIÇÃO (Agora com Cidade e Estado)
  const [editNome, setEditNome] = useState("");
  const [editTelefone, setEditTelefone] = useState("");
  const [editCidade, setEditCidade] = useState("");
  const [editEstado, setEditEstado] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const carregarUtilizador = async () => {
    try {
      const userData = await getMe();
      setUser(userData);
      
      // Carrega os dados atuais para dentro dos inputs do modal
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

  useEffect(() => { 
    carregarUtilizador(); 
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    Cookies.remove("token");
    router.replace("/login");
  };

  const toggleDisponibilidade = async () => {
    if (!user) return;
    try {
      const novoStatus = !user.disponivel;
      await updateMe(user.id, { disponivel: novoStatus });
      setUser({ ...user, disponivel: novoStatus });
      toast.success(novoStatus ? "Você está disponível!" : "Você está offline.");
    } catch (error) {
      toast.error("Erro ao alterar status.");
    }
  };

  // ✨ FUNÇÃO ATUALIZADA: Agora envia também a cidade e o estado para a API
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateMe(user.id, { 
        nome: editNome, 
        telefone: editTelefone,
        cidade: editCidade,
        estado: editEstado.toUpperCase() // Força o estado a ficar em maiúsculas (ex: PI, SP)
      });
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
                <button className={styles.avatarBtn} onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                  <FaCamera />
                </button>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: "none" }} />
            </div>
            
            <h2>{user?.nome}</h2>
            <p className={styles.userEmail}>{user?.email}</p>

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

          <button onClick={handleLogout} className={styles.logoutBtn}>
            <FaSignOutAlt /> Sair
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
                {/* Aqui mostra as informações reais do banco de dados */}
                <span>{user?.cidade || "Não informada"}, {user?.estado || "BR"}</span>
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

      {/* ✨ MODAL DE EDIÇÃO ATUALIZADO */}
      {isEditModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Editar Perfil</h3>
            <form onSubmit={handleSaveProfile}>
              
              <div className={styles.formGroup}>
                <label>Nome Completo</label>
<input value={editNome} onChange={(e) => setEditNome(e.target.value)} placeholder="Seu nome" required />              </div>
              
              <div className={styles.formGroup}>
                <label>Telefone</label>
                <input value={editTelefone} onChange={(e) => setEditTelefone(e.target.value)} placeholder="(00) 00000-0000" required />
              </div>

              {/* NOVOS CAMPOS: Cidade e Estado */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className={styles.formGroup} style={{ flex: 2 }}>
                  <label>Cidade</label>
                  <input value={editCidade} onChange={(e) => setEditCidade(e.target.value)} placeholder="Sua cidade" required />
                </div>
                
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label>Estado</label>
                  <input 
                    value={editEstado} 
                    onChange={(e) => setEditEstado(e.target.value)} 
                    placeholder="UF (Ex: PI)" 
                    maxLength={2} 
                    required 
                  />
                </div>
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