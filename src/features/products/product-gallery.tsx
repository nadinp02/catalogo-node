"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/types/catalog";

export function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = images[selectedIndex];

  if (!selected) {
    return (
      <div className="flex aspect-square items-center justify-center border border-border bg-muted text-muted-foreground">
        Sin imagen
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden border border-border bg-muted">
        <Image
          key={selected.id}
          src={selected.url}
          alt={selected.alt ?? productName}
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          priority
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2.5">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Ver imagen ${index + 1} de ${images.length}`}
              aria-current={index === selectedIndex}
              className={`relative aspect-square overflow-hidden border bg-muted outline-none transition-colors ${
                index === selectedIndex
                  ? "border-accent"
                  : "border-border opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt ?? `${productName} miniatura ${index + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
