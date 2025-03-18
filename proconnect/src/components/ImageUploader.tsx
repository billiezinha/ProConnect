"use client"
import React, { useState } from "react";
import { useUpload } from "../hook/useUpload";
import supabase from "@/config/supabase";

const ImageUploader: React.FC = () => {
  const { uploadFile, uploading, progress, downloadUrl, error } = useUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const {data, error} = await supabase.storage.from("servicos").upload(`${new Date().toISOString()}.${selectedFile.name.split('.').pop()}`, selectedFile)
      if (error) {
        console.error("Ocorreu um erro", error)
      } else {
        const {data: file} = await supabase.storage.from("servicos").getPublicUrl(data?.path)
        console.log(file)
        console.log(file.publicUrl)
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

      {downloadUrl && (
        <div>
          <p>Imagem enviada com sucesso!</p>
          <img src={downloadUrl} alt="Imagem enviada" style={{ width: 200, marginTop: 10 }} />
          <p>
            <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
              Ver imagem
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
