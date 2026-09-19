import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { formatArs, installmentAmount, usdToArs } from "@/lib/money";
import type { Product, StoreSettings } from "@/lib/types";
import { QuickAdd } from "@/components/quick-add";

export function ProductCard({
  product,
  settings,
  priority = false,
}: {
  product: Product;
  settings: StoreSettings;
  priority?: boolean;
}) {
  const priceArs = usdToArs(product.priceUsd, settings.usdRate);
  const cuota = installmentAmount(priceArs, settings.maxInstallments);
  const image = product.images[0];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-sand-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-sand-300 hover:shadow-[var(--shadow-lift)]">
      <Link href={`/productos/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-sand-50">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : null}
        {product.badges.length > 0 ? (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {product.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-ink-800/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-volt-300 backdrop-blur"
              >
                {badge}
              </span>
            ))}
          </div>
        ) : null}
        {product.stock === 0 ? (
          <div className="absolute inset-0 grid place-items-center bg-white/70 backdrop-blur-[2px]">
            <span className="rounded-full bg-ink-800 px-4 py-2 text-sm font-semibold text-white">Sin stock</span>
          </div>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11.5px] font-semibold uppercase tracking-wider text-sand-400">{product.brand}</p>
        <h3 className="mt-1 text-[17px] font-semibold leading-snug tracking-tight text-ink-800">
          <Link href={`/productos/${product.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-sand-600">{product.shortDescription}</p>

        <ul className="mt-3.5 space-y-1.5">
          {product.highlights.slice(0, 2).map((h) => (
            <li key={h} className="flex items-start gap-1.5 text-[13px] leading-snug text-sand-600">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-volt-500" aria-hidden />
              <span>{h}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-5">
          <p className="text-[22px] font-semibold tracking-tight text-ink-800">{formatArs(priceArs)}</p>
          <p className="mt-0.5 text-[13px] text-volt-700">
            {settings.maxInstallments} cuotas sin interés de {formatArs(cuota)}
          </p>
          <div className="relative z-10 mt-4">
            <QuickAdd
              line={{
                slug: product.slug,
                id: product.id,
                name: product.name,
                priceArs,
                image: image?.url ?? "",
                sku: product.sku,
                category: product.categorySlug,
              }}
              disabled={product.stock === 0}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
