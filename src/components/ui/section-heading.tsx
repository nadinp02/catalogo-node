import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
} as const;

export function SectionHeading({
  children,
  as: Tag = "h1",
  size = "md",
  glitch = false,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  size?: keyof typeof SIZES;
  glitch?: boolean;
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        "flex items-center gap-3 font-mono font-bold tracking-tight uppercase",
        SIZES[size],
        className,
      )}
    >
      <span aria-hidden className="h-[0.8em] w-1 shrink-0 bg-primary" />
      {/* text-glitch fuerza display:inline-block (ver globals.css) — va en
          este span, no en Tag, para no pisar el "flex" del contenedor. */}
      <span className={cn(glitch && "text-glitch")}>
        {children} <span className="text-accent">{"//"}</span>
      </span>
    </Tag>
  );
}
