"use client"
import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = (file: File) => {
    if (!file) return;

    setUploading(true);
    setError(null);

    const storageRef = ref(storage, `uploads/${file.name}-${Date.now()}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Atualiza a barra de progresso
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        setError("Erro ao fazer upload");
        setUploading(false);
      },
      async () => {
        // Obtém a URL do arquivo
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setDownloadUrl(url);
        setUploading(false);
      }
    );
  };

  return { uploadFile, uploading, progress, downloadUrl, error };
};
