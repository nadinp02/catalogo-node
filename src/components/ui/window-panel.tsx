import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Envoltorio visual que simula una ventana de software (chrome estilo
 * Windows 95 / DedSec). Los "botones" de la barra son decorativos
 * (aria-hidden, sin onClick) — nunca agregan comportamiento de ventana.
 */
export function WindowPanel({
  title,
  icon,
  actions,
  className,
  bodyClassName,
  children,
}: {
  title: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("border border-border bg-card", className)}>
      <div className="flex h-8 items-center justify-between gap-2 border-b border-border bg-[#0d0d0f] px-3">
        <div className="flex min-w-0 items-center gap-2">
          {icon}
          <span className="truncate font-mono text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {actions}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2.5 border border-border bg-secondary" />
            <span className="size-2.5 border border-border bg-accent" />
            <span className="size-2.5 border border-border bg-primary" />
          </div>
        </div>
      </div>
      <div className={cn(bodyClassName)}>{children}</div>
    </div>
  );
}
