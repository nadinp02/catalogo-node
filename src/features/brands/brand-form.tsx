"use client";

import { useActionState } from "react";
import { WindowPanel } from "@/components/ui/window-panel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SubmitButton } from "@/components/submit-button";
import { FieldError } from "@/components/field-error";
import { createBrandAction, updateBrandAction } from "@/actions/brands/actions";
import { emptyFormState } from "@/types/form-state";
import type { Brand } from "@/types/catalog";

export function BrandForm({ brand }: { brand?: Brand }) {
  const action = brand ? updateBrandAction.bind(null, brand.id) : createBrandAction;
  const [state, formAction] = useActionState(action, emptyFormState);

  return (
    <WindowPanel title={brand ? "EDITAR MARCA" : "NUEVA MARCA"} className="max-w-md">
      <div className="p-5">
        <form action={formAction} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" defaultValue={brand?.name} required />
            <FieldError message={state.errors.name?.[0]} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" defaultValue={brand?.slug} required />
            <FieldError message={state.errors.slug?.[0]} />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="isActive" name="isActive" defaultChecked={brand?.isActive ?? true} />
            <Label htmlFor="isActive">Activa</Label>
          </div>

          <SubmitButton className="w-full sm:w-auto">
            {brand ? "Guardar cambios" : "Crear marca"}
          </SubmitButton>
        </form>
      </div>
    </WindowPanel>
  );
}
