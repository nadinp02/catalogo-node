"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { upsertAnnouncement } from "@/services/announcements";
import type { FormState } from "@/types/form-state";

function parseOptionalDate(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") return null;
  return new Date(value);
}

function parseOptionalText(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") return null;
  return value.trim();
}

const announcementSchema = z.object({
  isActive: z.boolean(),
  startAt: z.date().nullable(),
  endAt: z.date().nullable(),
  title: z.string().trim().min(1, "El título es obligatorio"),
  description: z.string().nullable(),
  buttonText: z.string().nullable(),
  url: z
    .string()
    .nullable()
    .refine((value) => value === null || /^https?:\/\//i.test(value), {
      message: "La URL debe empezar con http:// o https://",
    }),
});

export async function updateAnnouncementAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = announcementSchema.safeParse({
    isActive: formData.get("isActive") === "on",
    startAt: parseOptionalDate(formData.get("startAt")),
    endAt: parseOptionalDate(formData.get("endAt")),
    title: formData.get("title"),
    description: parseOptionalText(formData.get("description")),
    buttonText: parseOptionalText(formData.get("buttonText")),
    url: parseOptionalText(formData.get("url")),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await upsertAnnouncement(parsed.data);
  // Invalida el layout público entero: el popup se lee ahí, no en una
  // ruta puntual, así que revalidatePath("/administracion/anuncio") solo
  // no alcanzaría para refrescarlo.
  revalidatePath("/", "layout");
  revalidatePath("/administracion/anuncio");
  redirect("/administracion/anuncio");
}
