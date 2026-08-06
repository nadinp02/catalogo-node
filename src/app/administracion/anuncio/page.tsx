import { getAnnouncement } from "@/services/announcements";
import { AnnouncementForm } from "@/features/announcements/announcement-form";
import { SectionHeading } from "@/components/ui/section-heading";

export default async function AnuncioPage() {
  const announcement = await getAnnouncement();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <SectionHeading>Cartel flotante</SectionHeading>
        <p className="text-sm text-muted-foreground">
          Popup configurable que aparece abajo a la derecha del sitio público.
        </p>
      </div>

      <AnnouncementForm announcement={announcement} />
    </div>
  );
}
