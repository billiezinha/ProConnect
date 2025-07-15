"use client";

import { useSearchParams } from "next/navigation";
import Modal from "./Modal";
import { Suspense } from "react";

export default function ModalServicoPage() {
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id")); 

  return (
    <Suspense>
      <Modal id={id} onClose={() => {}} />;
    </Suspense>
  ) 
}
