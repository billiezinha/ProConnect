"use client";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { getMe, uploadFotoPerfil, removerFotoPerfil } from "@/service/userService";
import type { User } from "@/interfaces/UserProps";
import styles from "./page.module.css";
import { 
  FaUserCircle, FaPhone, FaMapMarkerAlt, 
  FaEdit, FaSignOutAlt, FaBriefcase, FaPlusCircle, FaClipboardList, FaCamera, FaTrash
} from "react-icons/fa";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Referência para o input de ficheiro (para podermos clicar nele através de outro botão)
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    Cookies.remove("token");
    router.replace("/login");
  };

  const carregarUtilizador = async () => {
    try {
      const userData = await getMe();
      setUser(userData);
    } catch {
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUtilizador();
  }, []);

  // Função para enviar a imagem
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("imagem", file); // Deve bater com o "upload.single('imagem')" do back-end

    setUploading(true);
    try {
      await uploadFotoPerfil(formData);
      toast.success("Foto de perfil atualizada!");
      await carregarUtilizador(); // Recarrega os dados para mostrar a foto nova
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      toast.error("Não foi possível atualizar a foto.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Limpa o input
    }
  };

  // Função para remover a imagem
  const handleRemoverFoto = async () => {
    if (!confirm("Tem a certeza que deseja remover a sua foto de perfil?")) return;
    
    setUploading(true);
    try {
      await removerFotoPerfil();
      toast.success("Foto removida com sucesso!");
      await carregarUtilizador();
    } catch (error) {
      console.error("Erro ao remover imagem:", error);
      toast.error("Erro ao remover a foto.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className={styles.loadingState}>A carregar painel...</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Sidebar do Perfil */}
        <aside className={styles.sidebar}>
          <div className={styles.userCore}>
            
            {/* ÁREA DA FOTO DE PERFIL */}
            <div className={styles.avatarContainer}>
              {user?.imagem ? (
                <img src={user.imagem} alt="Foto de Perfil" className={styles.avatarImg} />
              ) : (
                <FaUserCircle className={styles.avatarPlaceholder} />
              )}
              
              {/* Overlay de edição da foto */}
              <div className={styles.avatarOverlay}>
                <button 
                  className={styles.avatarBtn} 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  title="Mudar Foto"
                >
                  <FaCamera />
                </button>
                {user?.imagem && (
                  <button 
                    className={`${styles.avatarBtn} ${styles.btnRemover}`} 
                    onClick={handleRemoverFoto}
                    disabled={uploading}
                    title="Remover Foto"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
              
              {/* Input escondido */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                style={{ display: "none" }} 
              />
            </div>
            
            {uploading && <p className={styles.uploadingText}>A atualizar foto...</p>}

            <h2>{user?.nome}</h2>
            <p className={styles.userEmail}>{user?.email}</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <FaSignOutAlt /> Sair da conta
          </button>
        </aside>

        {/* Conteúdo Principal */}
        <main className={styles.content}>
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h3><FaUserCircle /> Dados Pessoais</h3>
              <button className={styles.editBtn}><FaEdit /> Editar Perfil</button>
            </div>
            <div className={styles.infoGrid}>
              <div className={styles.infoBox}>
                <label><FaPhone /> Telefone</label>
                <span>{user?.telefone || "Não cadastrado"}</span>
              </div>
              <div className={styles.infoBox}>
                <label><FaMapMarkerAlt /> Localização</label>
                <span>{user?.cidade || "Picos"}, {user?.estado || "PI"}</span>
              </div>
            </div>
          </section>

          {/* Cards de Ação */}
          <div className={styles.quickActions}>
            <div onClick={() => router.push("/meus-servicos")} className={styles.actionCard}>
              <FaBriefcase />
              <h4>Meus Serviços</h4>
              <p>Gira os seus anúncios em Picos.</p>
            </div>
            <div onClick={() => router.push("/cadastro-servico")} className={styles.actionCard}>
              <FaPlusCircle />
              <h4>Novo Anúncio</h4>
              <p>Atraia mais clientes agora.</p>
            </div>
            <div onClick={() => router.push("/meus-pedidos")} className={styles.actionCard}>
              <FaClipboardList />
              <h4>Meus Pedidos</h4>
              <p>Profissionais que contactou.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}