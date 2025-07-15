"use client";

import { useSearchParams } from "next/navigation";
import Modal from "./Modal";

export default function ModalServicoPage() {
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id")); 

  return <Modal id={id} onClose={() => {}} />;
}
