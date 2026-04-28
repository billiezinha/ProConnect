"use client";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { getMe, uploadFotoPerfil, updateMe } from "@/service/userService";
import type { User } from "@/interfaces/UserProps";
import styles from "./page.module.css";
import { useSearchParams } from "next/navigation";
import { 
  FaUserCircle, FaPhone, FaMapMarkerAlt, 
  FaEdit, FaSignOutAlt, FaBriefcase, FaPlusCircle, FaCamera, FaCheckCircle, FaTimesCircle, FaStar
} from "react-icons/fa";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { LoadingProfile } from "@/components/loading/Loading";

export default function PerfilPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
      
      // Mock do plano Pro se vier do redirecionamento
      if (searchParams.get('sucesso_plano') === 'true') {
        userData.plano = "premium";
      }

      setUser(userData);
      setEditNome(userData.nome || "");
      setEditTelefone(userData.telefone || "");
      setEditCidade(userData.cidade || "");
      // Força o estado a ficar em maiúsculas ao carregar os dados
      setEditEstado(userData.estado?.toUpperCase() || "");
    } catch {
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    carregarUtilizador(); 
    if (searchParams.get('sucesso_plano') === 'true') {
      setTimeout(() => {
        toast.success("Parabéns! Você agora é um profissional PRO Ouro! 🌟", { duration: 5000 });
        router.replace("/perfil"); // limpa a URL
      }, 500);
    }
  }, [searchParams, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    Cookies.remove("token");
    router.replace("/login");
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("imagem", file);

    setUploading(true);
    const toastId = toast.loading("A atualizar foto...");

    try {
      await uploadFotoPerfil(formData);
      toast.success("Foto de perfil atualizada!", { id: toastId });
      await carregarUtilizador(); 
    } catch (error) {
      toast.error("Erro ao fazer upload da imagem.", { id: toastId });
    } finally {
      setUploading(false);
    }
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

  const handleToggleDisponibilidade = async () => {
    if (!user) return;
    const novoStatus = !user.disponivel;
    setUser({ ...user, disponivel: novoStatus });

    try {
      await updateMe(user.id, { disponivel: novoStatus });
      toast.success(novoStatus ? "Selo ativado! Está disponível." : "Selo desativado. Está offline.");
    } catch (error) {
      setUser({ ...user, disponivel: !novoStatus });
      toast.error("Erro ao alterar disponibilidade.");
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
              {user?.plano === "premium" && (
                <div title="Profissional Ouro" style={{ position: 'absolute', bottom: 5, right: 10, background: '#ffc107', borderRadius: '50%', padding: '4px', display: 'flex', boxShadow: '0 2px 10px rgba(0,0,0,0.3)', border: '2px solid #fff' }}>
                  <FaStar size={16} color="#000" />
                </div>
              )}
              <div className={styles.avatarOverlay}>
                <button 
                  className={styles.avatarBtn} 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <FaCamera />
                </button>
              </div>
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
              accept="image/*" 
            />

            <h2>{user?.nome}</h2>
            <p className={styles.userEmail}>{user?.email}</p>

            <div className={styles.statusSection}>
               <button 
                 onClick={handleToggleDisponibilidade} 
                 className={`${styles.statusToggle} ${user?.disponivel ? styles.online : styles.offline}`}
               >
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
            {user?.plano === "premium" ? (
              <div onClick={() => router.push("/dashboard")} className={`${styles.actionCard} ${styles.actionCardPro}`}>
                <FaStar style={{ color: '#ffc107' }} /><h4>Meu Dashboard</h4>
              </div>
            ) : (
              <div onClick={() => router.push("/#planos")} className={`${styles.actionCard} ${styles.actionCardPro}`}>
                <FaStar style={{ color: '#ffc107' }} /><h4>Plano Pro</h4>
              </div>
            )}
          </div>
        </main>
      </div>

      {isEditModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsEditModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Editar Perfil</h3>
            
            <form className={styles.form} onSubmit={handleSaveProfile}>
              <div className={styles.formGroup}>
                <label htmlFor="nome">Nome Completo</label>
                <input id="nome" value={editNome} onChange={(e) => setEditNome(e.target.value)} required />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="telefone">Telefone</label>
                <input id="telefone" value={editTelefone} onChange={(e) => setEditTelefone(e.target.value)} required />
              </div>
              
<div className={styles.formRow}>
                {/* Cidade ocupa todo o espaço livre */}
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label htmlFor="cidade">Cidade</label>
                  <input id="cidade" value={editCidade} onChange={(e) => setEditCidade(e.target.value)} required />
                </div>
                
                {/* UF com tamanho fixo e texto centralizado */}
                <div className={styles.formGroup} style={{ width: "90px" }}>
                  <label htmlFor="uf">UF</label>
                  <input 
                    id="uf" 
                    value={editEstado} 
                    onChange={(e) => setEditEstado(e.target.value.toUpperCase())} 
                    maxLength={2} 
                    required 
                    style={{ textAlign: "center" }} /* Centraliza as 2 letrinhas */
                  />
                </div>
              </div>
              
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className={styles.cancelBtn}>
                  Cancelar
                </button>
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