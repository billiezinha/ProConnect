"use client";

import { useSearchParams } from "next/navigation";
import Modal from "./Modal";

export default function ModalServicoPage() {
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id")); // pega ?id=1 da URL

  return <Modal id={id} onClose={() => {}} />;
}
