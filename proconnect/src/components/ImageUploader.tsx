"use client";

import React, { useState } from "react";
import supabase from "@/config/supabase"; // Certifique-se de que a configuração do Supabase está correta

interface ImageUploaderProps {
  setImageUrl: (url: string) => void; // Passa a função para setar a URL da imagem
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ setImageUrl }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setUploading(true);
      setError(null);

      const filePath = `${new Date().toISOString()}.${selectedFile.name.split('.').pop()}`;

      try {
        const { data, error: uploadError } = await supabase.storage
          .from("servicos")
          .upload(filePath, selectedFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          setError("Erro ao fazer upload da imagem");
          setUploading(false);
          return;
        }

        const { data: fileData } = await supabase.storage
          .from("servicos")
          .getPublicUrl(data?.path);

        if (fileData?.publicUrl) {
          // Passa a URL da imagem para o componente pai (Cadastro)
          setImageUrl(fileData.publicUrl);
        }
      } catch (err) {
        setError("Erro desconhecido ao fazer upload.");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Enviando..." : "Fazer Upload"}
      </button>

      {uploading && <p>Progresso: {progress.toFixed(2)}%</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ImageUploader;
