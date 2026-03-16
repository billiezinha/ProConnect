"use client";
import { useState, ChangeEvent } from "react";
import { uploadFotoPortfolio } from "@/service/portfolioService";
import toast from "react-hot-toast";
import styles from "./UploadPortfolio.module.css";
import { FaCloudUploadAlt, FaSpinner } from "react-icons/fa";

interface UploadPortfolioProps {
  servicoId: number;
  onUploadSuccess: () => void; // Função para atualizar a galeria após o envio
}

export default function UploadPortfolio({ servicoId, onUploadSuccess }: UploadPortfolioProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Quando o utilizador escolhe uma imagem
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Cria um URL temporário para mostrar um preview da imagem
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    }
  };

  // Quando o utilizador clica em "Salvar Foto"
  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      // O nome "file" ou "imagem" depende de como o multer está configurado no teu backend
      formData.append("imagem", file); 
      formData.append("servicoId", String(servicoId));

      await uploadFotoPortfolio(formData);
      
      toast.success("Foto adicionada ao portfólio!");
      setFile(null);
      setPreview(null);
      onUploadSuccess(); // Avisa a tela pai para recarregar as imagens
    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error("Erro ao enviar a imagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <h4>Adicionar nova foto ao portfólio</h4>
      
      <div className={styles.dropzone}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          id={`upload-${servicoId}`}
          className={styles.fileInput}
        />
        <label htmlFor={`upload-${servicoId}`} className={styles.label}>
          <FaCloudUploadAlt size={30} />
          <span>Clique para escolher uma imagem</span>
        </label>
      </div>

      {preview && (
        <div className={styles.previewArea}>
          <img src={preview} alt="Preview" className={styles.previewImage} />
          <button 
            onClick={handleUpload} 
            disabled={loading}
            className={styles.btnUpload}
          >
            {loading ? <FaSpinner className={styles.spinner} /> : "Salvar Foto no Portfólio"}
          </button>
        </div>
      )}
    </div>
  );
}