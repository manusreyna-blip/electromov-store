"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/types";

export function Gallery({ images, badges }: { images: ProductImage[]; badges: string[] }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-sand-200 bg-sand-50">
        {current ? (
          <Image
            src={current.url}
            alt={current.alt}
            fill
            priority
            sizes="(max-width: 1024px) 92vw, 560px"
            className="object-contain p-8"
          />
        ) : null}
        {badges.length > 0 ? (
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-ink-800 px-3 py-1 text-[11.5px] font-semibold uppercase tracking-wide text-volt-300"
              >
                {badge}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mt-3 flex gap-3">
          {images.map((image, i) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              aria-current={i === active}
              className={`relative h-20 w-20 overflow-hidden rounded-xl border bg-sand-50 transition-colors ${
                i === active ? "border-ink-800" : "border-sand-200 hover:border-sand-300"
              }`}
            >
              <Image src={image.url} alt="" fill sizes="80px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
