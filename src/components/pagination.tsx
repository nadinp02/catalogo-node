import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const linkClass =
    "inline-flex items-center gap-1.5 border border-border px-3.5 py-2 font-mono text-xs uppercase tracking-wide transition-colors hover:border-accent hover:text-foreground";
  const disabledClass =
    "inline-flex items-center gap-1.5 border border-transparent px-3.5 py-2 font-mono text-xs uppercase tracking-wide text-muted-foreground/50";

  return (
    <nav className="flex items-center justify-center gap-4 pt-4">
      {page > 1 ? (
        <Link href={buildHref(page - 1)} className={linkClass}>
          <ChevronLeft className="size-4" />
          Anterior
        </Link>
      ) : (
        <span className={disabledClass}>
          <ChevronLeft className="size-4" />
          Anterior
        </span>
      )}
      <span className="font-mono text-xs text-muted-foreground uppercase">
        Página {page} de {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={buildHref(page + 1)} className={linkClass}>
          Siguiente
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className={disabledClass}>
          Siguiente
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
