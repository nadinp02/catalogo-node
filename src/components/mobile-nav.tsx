"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
] as const;

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        className="flex size-8 items-center justify-center text-foreground transition-colors hover:text-accent"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-12 z-40 flex flex-col border-b border-border bg-[#0d0d0f] px-4 py-3 font-mono text-sm font-medium tracking-wide text-muted-foreground uppercase">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-border/60 py-3 transition-colors last:border-b-0 hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
