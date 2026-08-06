import { prisma } from "@/lib/prisma";

// Fila fija: el cartel flotante es una configuración única, no una lista.
const ANNOUNCEMENT_ID = "singleton";

export function getAnnouncement() {
  return prisma.announcement.findUnique({ where: { id: ANNOUNCEMENT_ID } });
}

type AnnouncementInput = {
  isActive: boolean;
  startAt: Date | null;
  endAt: Date | null;
  title: string;
  description: string | null;
  buttonText: string | null;
  url: string | null;
};

export function upsertAnnouncement(data: AnnouncementInput) {
  return prisma.announcement.upsert({
    where: { id: ANNOUNCEMENT_ID },
    create: { id: ANNOUNCEMENT_ID, ...data },
    update: data,
  });
}

/**
 * Lo que ve el sitio público: null salvo que esté activo y la fecha actual
 * caiga dentro del rango configurado (endAt se trata como fin del día).
 */
export async function getActiveAnnouncement() {
  const announcement = await getAnnouncement();
  if (!announcement || !announcement.isActive) return null;

  const now = new Date();
  if (announcement.startAt && announcement.startAt > now) return null;
  if (announcement.endAt) {
    const endOfDay = new Date(announcement.endAt);
    endOfDay.setHours(23, 59, 59, 999);
    if (endOfDay < now) return null;
  }

  return announcement;
}
