"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import type { Servico, UpdateServicoPayload } from "@/interfaces/ServicoProps";
import { getCategorias } from "@/service/categoriaService";
import type { Categoria } from "@/interfaces/CategoriaProps";

type Props = {
  servico: Servico | null;
  onClose: () => void;
  onSave: (data: UpdateServicoPayload) => void | Promise<void>;
};

export default function EditServicoModal({ servico, onClose, onSave }: Props) {
  const [nomeNegocio, setNomeNegocio] = useState(servico?.nomeNegocio ?? "");
  const [descricao, setDescricao] = useState(servico?.descricao ?? "");
  const [categoriaId, setCategoriaId] = useState<number | "">(
    servico?.categoria?.id ?? ""
  );
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setNomeNegocio(servico?.nomeNegocio ?? "");
    setDescricao(servico?.descricao ?? "");
    setCategoriaId(servico?.categoria?.id ?? "");
  }, [servico]);

  useEffect(() => {
    (async () => {
      try {
        const list = await getCategorias();
        setCategorias(list);
      } catch {
        setError("Não foi possível carregar categorias.");
      } finally {
        setLoadingCats(false);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload: UpdateServicoPayload = {};
    if (nomeNegocio.trim() !== servico?.nomeNegocio) payload.nomeNegocio = nomeNegocio.trim();
    if (descricao.trim() !== servico?.descricao) payload.descricao = descricao.trim();
    if (typeof categoriaId === "number" && categoriaId !== servico?.categoria?.id) {
      payload.categoriaId = categoriaId;
    }

    try {
      await onSave(payload);
    } catch {
      // <-- removido o parâmetro não usado (antes: catch (e))
      setError("Falha ao salvar alterações.");
    } finally {
      setSaving(false);
    }
  };

  if (!servico) return null;

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="edit-title">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 id="edit-title">Editar Serviço</h2>
          <button type="button" onClick={onClose} className={styles.closeBtn} aria-label="Fechar">×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.formGroup}>
            <label htmlFor="nomeNegocio">Nome do Negócio</label>
            <input
              id="nomeNegocio"
              value={nomeNegocio}
              onChange={(ev) => setNomeNegocio(ev.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              rows={4}
              value={descricao}
              onChange={(ev) => setDescricao(ev.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="categoriaId">Categoria</label>
            {loadingCats ? (
              <div className={styles.hint}>Carregando categorias…</div>
            ) : (
              <select
                id="categoriaId"
                value={categoriaId}
                onChange={(ev) => setCategoriaId(Number(ev.target.value))}
                required
              >
                <option value="" disabled>Selecione</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.nomeServico}</option>
                ))}
              </select>
            )}
          </div>

          <div className={styles.footer}>
            <button type="button" onClick={onClose} className={styles.secondary}>Cancelar</button>
            <button type="submit" className={styles.primary} disabled={saving}>
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
