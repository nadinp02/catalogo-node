"use client";

import { Trash2 } from "lucide-react";
import { SubmitButton } from "@/components/submit-button";

export function DeleteButton({
  action,
  confirmMessage = "¿Seguro que querés eliminar este elemento?",
}: {
  action: (formData: FormData) => void | Promise<void>;
  confirmMessage?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <SubmitButton variant="destructive" size="sm" className="gap-1.5">
        <Trash2 className="size-3.5" />
        Eliminar
      </SubmitButton>
    </form>
  );
}
